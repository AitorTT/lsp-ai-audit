import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import prisma from "@lsp/database";
import { Prisma } from "@prisma/client";
import { AUDIT_STATUS_FLOW } from "@lsp/shared";
import { CreateAuditDto } from "./dto/create-audit.dto";
import { UpdateAuditDto } from "./dto/update-audit.dto";
import { AuditQueryDto } from "./dto/audit-query.dto";
import { CreateFindingDto } from "./dto/create-finding.dto";
import { UpdateFindingDto } from "./dto/update-finding.dto";

@Injectable()
export class AuditsService {
  async create(dto: CreateAuditDto, consultantId: string) {
    return prisma.audit.create({
      data: {
        title: dto.title,
        description: dto.description,
        scope: dto.scope,
        status: "DRAFT",
        clientId: dto.clientId,
        consultantId,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
      include: {
        client: { select: { id: true, name: true } },
        consultant: { select: { id: true, name: true } },
      },
    });
  }

  async findAll(query: AuditQueryDto) {
    const { status, clientId, consultantId, scope, page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.AuditWhereInput = {};
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    if (consultantId) where.consultantId = consultantId;
    if (scope) where.scope = scope;

    const orderBy: Prisma.AuditOrderByWithRelationInput = {};
    if (sortBy === "title") {
      orderBy.title = sortOrder;
    } else if (sortBy === "status") {
      orderBy.status = sortOrder;
    } else if (sortBy === "createdAt") {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === "startDate") {
      orderBy.startDate = sortOrder;
    } else {
      orderBy.createdAt = "desc";
    }

    const [data, total] = await Promise.all([
      prisma.audit.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          client: { select: { id: true, name: true } },
          consultant: { select: { id: true, name: true } },
          _count: { select: { findings: true } },
        },
      }),
      prisma.audit.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const audit = await prisma.audit.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, type: true, logo: true } },
        consultant: { select: { id: true, name: true, email: true } },
        findings: true,
        report: true,
      },
    });

    if (!audit) {
      throw new NotFoundException("Audit not found");
    }

    return audit;
  }

  async update(id: string, dto: UpdateAuditDto) {
    const existing = await prisma.audit.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Audit not found");
    }

    const { status, ...fields } = dto;

    if (status) {
      this.validateStatusTransition(existing.status, status);
    }

    const data: any = { ...fields };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);

    return prisma.audit.update({
      where: { id },
      data: { ...data, ...(status ? { status: status as any } : {}) },
      include: {
        client: { select: { id: true, name: true } },
        consultant: { select: { id: true, name: true } },
        _count: { select: { findings: true } },
      },
    });
  }

  async remove(id: string) {
    const existing = await prisma.audit.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Audit not found");
    }

    await prisma.audit.delete({ where: { id } });
  }

  async getMetrics() {
    const [total, byStatus, reportAgg, costAgg] = await Promise.all([
      prisma.audit.count(),
      prisma.audit.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.report.aggregate({
        _avg: { score: true },
      }),
      prisma.finding.aggregate({
        _sum: { costSavingsEst: true },
      }),
    ]);

    const statusDistribution = byStatus.reduce(
      (acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total,
      statusDistribution,
      avgScore: reportAgg._avg.score ?? 0,
      totalCostSavings: costAgg._sum.costSavingsEst ?? 0,
    };
  }

  async addFinding(auditId: string, dto: CreateFindingDto) {
    const audit = await prisma.audit.findUnique({ where: { id: auditId } });
    if (!audit) {
      throw new NotFoundException("Audit not found");
    }

    return prisma.finding.create({
      data: {
        auditId,
        title: dto.title,
        description: dto.description,
        severity: dto.severity,
        category: dto.category,
        impact: dto.impact,
        recommendation: dto.recommendation,
        effortHours: dto.effortHours,
        costSavingsEst: dto.costSavingsEst,
      },
    });
  }

  async updateFinding(findingId: string, dto: UpdateFindingDto) {
    const existing = await prisma.finding.findUnique({ where: { id: findingId } });
    if (!existing) {
      throw new NotFoundException("Finding not found");
    }

    return prisma.finding.update({
      where: { id: findingId },
      data: dto,
    });
  }

  async removeFinding(findingId: string) {
    const existing = await prisma.finding.findUnique({ where: { id: findingId } });
    if (!existing) {
      throw new NotFoundException("Finding not found");
    }

    await prisma.finding.delete({ where: { id: findingId } });
  }

  async updateStatus(id: string, status: string) {
    const audit = await prisma.audit.findUnique({ where: { id } });
    if (!audit) {
      throw new NotFoundException("Audit not found");
    }

    this.validateStatusTransition(audit.status, status);

    return prisma.audit.update({
      where: { id },
      data: { status: status as any },
      include: {
        client: { select: { id: true, name: true } },
        consultant: { select: { id: true, name: true } },
        _count: { select: { findings: true } },
      },
    });
  }

  private validateStatusTransition(current: string, next: string) {
    const allowed = AUDIT_STATUS_FLOW[current as keyof typeof AUDIT_STATUS_FLOW];
    if (!allowed || !allowed.includes(next as any)) {
      throw new BadRequestException(
        `Invalid status transition from ${current} to ${next}`,
      );
    }
  }
}
