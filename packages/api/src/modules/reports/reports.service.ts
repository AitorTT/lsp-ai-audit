import { Injectable, NotFoundException } from "@nestjs/common";
import prisma from "@lsp/database";
import { Prisma } from "@prisma/client";
import { FindingSeverity } from "@lsp/shared";

const SEVERITY_WEIGHTS: Record<string, number> = {
  CRITICAL: 10,
  HIGH: 7,
  MEDIUM: 5,
  LOW: 3,
  INFO: 1,
};

const MAX_SCORE = 10;

function parseReportArrays(report: any): any {
  const result = { ...report };
  for (const field of ['strengths', 'weaknesses', 'recommendations']) {
    if (result[field] && typeof result[field] === 'string') {
      try { result[field] = JSON.parse(result[field]); } catch {}
    }
  }
  return result;
}

@Injectable()
export class ReportsService {
  async generate(auditId: string, format: "PDF" | "JSON" | "HTML") {
    const audit = await prisma.audit.findUnique({
      where: { id: auditId },
      include: {
        findings: true,
        client: { select: { id: true, name: true, type: true } },
        consultant: { select: { id: true, name: true, email: true } },
      },
    });

    if (!audit) {
      throw new NotFoundException("Audit not found");
    }

    const findings = audit.findings;
    const totalWeight = findings.reduce(
      (sum, f) => sum + (SEVERITY_WEIGHTS[f.severity] || 0),
      0,
    );
    const maxPossibleWeight = findings.length * SEVERITY_WEIGHTS.CRITICAL;
    const rawScore = maxPossibleWeight > 0 ? (totalWeight / maxPossibleWeight) * MAX_SCORE : 0;
    const score = Math.round((MAX_SCORE - rawScore) * 10) / 10;

    const strengths = findings
      .filter((f) => !["CRITICAL", "HIGH"].includes(f.severity))
      .map((f) => `${f.category}: ${f.title} — ${f.recommendation || "Positive aspect noted."}`);

    const weaknesses = findings
      .filter((f) => ["CRITICAL", "HIGH"].includes(f.severity))
      .map((f) => `[${f.severity}] ${f.title}: ${f.description || "Issue identified."} Impact: ${f.impact || "N/A"}`);

    const recommendations = findings
      .filter((f) => f.recommendation)
      .map((f) => `[${f.category}] ${f.recommendation}`);

    const existingReport = await prisma.report.findUnique({
      where: { auditId },
    });

    const summary = `Audit "${audit.title}" completed for ${audit.client.name}. Overall score: ${score}/10. Total findings: ${findings.length}.`;

    if (existingReport) {
      const result = await prisma.report.update({
        where: { auditId },
        data: {
          summary,
          score,
          strengths: JSON.stringify(strengths),
          weaknesses: JSON.stringify(weaknesses),
          recommendations: JSON.stringify(recommendations),
          generatedAt: new Date(),
        },
        include: {
          audit: {
            select: {
              id: true,
              title: true,
              client: { select: { id: true, name: true } },
            },
          },
        },
      });
      return parseReportArrays(result);
    }

    const result = await prisma.report.create({
      data: {
        auditId,
        summary,
        score,
        strengths: JSON.stringify(strengths),
        weaknesses: JSON.stringify(weaknesses),
        recommendations: JSON.stringify(recommendations),
        generatedAt: new Date(),
      },
      include: {
        audit: {
          select: {
            id: true,
            title: true,
            client: { select: { id: true, name: true } },
          },
        },
      },
    });
    return parseReportArrays(result);
  }

  async findByAuditId(auditId: string) {
    const report = await prisma.report.findUnique({
      where: { auditId },
      include: {
        audit: {
          select: {
            id: true,
            title: true,
            client: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException("Report not found for this audit");
    }

    return parseReportArrays(report);
  }

  async findAll(query: { page?: number; limit?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.report.findMany({
        skip,
        take: limit,
        orderBy: { generatedAt: "desc" },
        include: {
          audit: {
            select: {
              id: true,
              title: true,
              client: { select: { id: true, name: true } },
            },
          },
        },
      }),
      prisma.report.count(),
    ]);

    return {
      data: data.map(parseReportArrays),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getScoreSummary(auditId: string) {
    const audit = await prisma.audit.findUnique({
      where: { id: auditId },
      include: { findings: true },
    });

    if (!audit) {
      throw new NotFoundException("Audit not found");
    }

    const findings = audit.findings;
    const categories = [...new Set(findings.map((f) => f.category))];

    const categoryScores = categories.map((category) => {
      const catFindings = findings.filter((f) => f.category === category);
      const totalWeight = catFindings.reduce(
        (sum, f) => sum + (SEVERITY_WEIGHTS[f.severity] || 0),
        0,
      );
      const maxPossible = catFindings.length * SEVERITY_WEIGHTS.CRITICAL;
      const rawScore = maxPossible > 0 ? (totalWeight / maxPossible) * MAX_SCORE : 0;
      const score = Math.round((MAX_SCORE - rawScore) * 10) / 10;

      return {
        category,
        score,
        findingCount: catFindings.length,
        severityBreakdown: {
          CRITICAL: catFindings.filter((f) => f.severity === "CRITICAL").length,
          HIGH: catFindings.filter((f) => f.severity === "HIGH").length,
          MEDIUM: catFindings.filter((f) => f.severity === "MEDIUM").length,
          LOW: catFindings.filter((f) => f.severity === "LOW").length,
          INFO: catFindings.filter((f) => f.severity === "INFO").length,
        },
      };
    });

    const totalWeight = findings.reduce(
      (sum, f) => sum + (SEVERITY_WEIGHTS[f.severity] || 0),
      0,
    );
    const maxPossibleWeight = findings.length * SEVERITY_WEIGHTS.CRITICAL;
    const rawTotal = maxPossibleWeight > 0 ? (totalWeight / maxPossibleWeight) * MAX_SCORE : 0;
    const overallScore = Math.round((MAX_SCORE - rawTotal) * 10) / 10;

    return {
      auditId,
      overallScore,
      totalFindings: findings.length,
      categories: categoryScores,
    };
  }
}
