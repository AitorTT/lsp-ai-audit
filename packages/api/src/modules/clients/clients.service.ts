import { Injectable, NotFoundException } from "@nestjs/common";
import prisma from "@lsp/database";
import { Prisma } from "@prisma/client";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { ClientQueryDto } from "./dto/client-query.dto";

function parseArrays(client: any): any {
  const result = { ...client };
  if (result.primaryLanguages && typeof result.primaryLanguages === 'string') {
    try { result.primaryLanguages = JSON.parse(result.primaryLanguages); } catch {}
  }
  return result;
}

@Injectable()
export class ClientsService {
  async create(dto: CreateClientDto, userId: string) {
    return prisma.client.create({
      data: {
        name: dto.name,
        type: dto.type,
        logo: dto.logo,
        website: dto.website,
        description: dto.description,
        employeeCount: dto.employeeCount,
        annualRevenue: dto.annualRevenue,
        primaryLanguages: JSON.stringify(dto.primaryLanguages),
        createdById: userId,
      },
    });
  }

  async findAll(query: ClientQueryDto) {
    const { search, type, page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ClientWhereInput = {};
    if (search) {
      where.name = { contains: search };
    }
    if (type) {
      where.type = type;
    }

    const orderBy: Prisma.ClientOrderByWithRelationInput = {};
    if (sortBy === "name") {
      orderBy.name = sortOrder;
    } else if (sortBy === "createdAt") {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === "employeeCount") {
      orderBy.employeeCount = sortOrder;
    } else {
      orderBy.createdAt = "desc";
    }

    const [data, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { _count: { select: { audits: true } } },
      }),
      prisma.client.count({ where }),
    ]);

    return {
      data: data.map(parseArrays),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const client = await prisma.client.findUnique({
      where: { id },
      include: { _count: { select: { audits: true } } },
    });

    if (!client) {
      throw new NotFoundException("Client not found");
    }

    return parseArrays(client);
  }

  async update(id: string, dto: UpdateClientDto) {
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Client not found");
    }

    const data: any = { ...dto };
    if (dto.primaryLanguages) {
      data.primaryLanguages = JSON.stringify(dto.primaryLanguages);
    }

    return prisma.client.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Client not found");
    }

    return prisma.client.delete({ where: { id } });
  }

  async getStats() {
    const [total, typeDistribution] = await Promise.all([
      prisma.client.count(),
      prisma.client.groupBy({
        by: ["type"],
        _count: { id: true },
      }),
    ]);

    const distribution = typeDistribution.reduce(
      (acc, item) => {
        acc[item.type] = item._count.id;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { total, typeDistribution: distribution };
  }
}
