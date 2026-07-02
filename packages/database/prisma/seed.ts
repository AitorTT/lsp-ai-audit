import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();
const passwordHash = hashSync('password123', 10);

async function main() {
  const admin1 = await prisma.user.create({
    data: {
      email: 'admin@lsp-audit.com',
      name: 'Alice Admin',
      passwordHash: passwordHash,
      role: 'ADMIN',
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      email: 'superadmin@lsp-audit.com',
      name: 'Bob Superadmin',
      passwordHash: passwordHash,
      role: 'ADMIN',
    },
  });

  const consultant = await prisma.user.create({
    data: {
      email: 'consultant@lsp-audit.com',
      name: 'Carol Consultant',
      passwordHash: passwordHash,
      role: 'CONSULTANT',
    },
  });

  const client1 = await prisma.client.create({
    data: {
      name: 'GlobalTrans Inc.',
      type: 'TRANSLATION_AGENCY',
      description: 'Leading translation agency with 500+ linguists worldwide.',
      employeeCount: 480,
      annualRevenue: 24.5,
      primaryLanguages: JSON.stringify(['en', 'es', 'fr', 'de', 'zh']),
      createdById: admin1.id,
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'InterpretNow Ltd.',
      type: 'INTERPRETATION_SERVICE',
      description: 'On-demand interpretation services for enterprises.',
      employeeCount: 120,
      annualRevenue: 8.2,
      primaryLanguages: JSON.stringify(['en', 'ja', 'ko', 'ar', 'pt']),
      createdById: admin1.id,
    },
  });

  const client3 = await prisma.client.create({
    data: {
      name: 'LocalizePro GmbH',
      type: 'LOCALIZATION_FIRM',
      description: 'Software and game localization specialist.',
      employeeCount: 65,
      annualRevenue: 5.8,
      primaryLanguages: JSON.stringify(['en', 'de', 'fr', 'it', 'nl', 'pl']),
      createdById: admin2.id,
    },
  });

  const audit1 = await prisma.audit.create({
    data: {
      title: 'GlobalTrans AI Readiness Assessment',
      description: 'Full evaluation of AI integration readiness for translation workflows.',
      scope: 'FULL',
      status: 'COMPLETED',
      clientId: client1.id,
      consultantId: consultant.id,
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-03-01'),
    },
  });

  const audit2 = await prisma.audit.create({
    data: {
      title: 'InterpretNow Process Efficiency Audit',
      description: 'Process audit focused on interpreter scheduling and dispatch.',
      scope: 'PROCESS_AUDIT',
      status: 'IN_PROGRESS',
      clientId: client2.id,
      consultantId: consultant.id,
      startDate: new Date('2025-05-01'),
    },
  });

  const audit3 = await prisma.audit.create({
    data: {
      title: 'LocalizePro Tooling Stack Review',
      description: 'Assessment of current CAT tools and automation potential.',
      scope: 'TOOL_ASSESSMENT',
      status: 'REVIEW',
      clientId: client3.id,
      consultantId: consultant.id,
      startDate: new Date('2025-04-10'),
      endDate: new Date('2025-06-15'),
    },
  });

  const audit4 = await prisma.audit.create({
    data: {
      title: 'GlobalTrans Cost Optimization Analysis',
      description: 'Identify cost-saving opportunities through AI-driven automation.',
      scope: 'COST_ANALYSIS',
      status: 'DRAFT',
      clientId: client1.id,
      consultantId: consultant.id,
    },
  });

  const audit5 = await prisma.audit.create({
    data: {
      title: 'InterpretNow AI Integration Pilot',
      description: 'Scoped assessment for integrating NLP-based post-editing.',
      scope: 'AI_INTEGRATION',
      status: 'ARCHIVED',
      clientId: client2.id,
      consultantId: consultant.id,
      startDate: new Date('2024-11-01'),
      endDate: new Date('2025-01-10'),
    },
  });

  await prisma.finding.createMany({
    data: [
      {
        auditId: audit1.id,
        title: 'No structured AI training data pipeline',
        description: 'The company lacks a systematic approach to collecting and labeling training data for AI models.',
        severity: 'HIGH',
        category: 'AI_READINESS',
        impact: 'Unable to train or fine-tune custom NMT models efficiently.',
        recommendation: 'Implement a data pipeline using a tool like Label Studio or Scale AI to capture bilingual corpora.',
        effortHours: 120,
        costSavingsEst: 45000,
        status: 'RESOLVED',
      },
      {
        auditId: audit1.id,
        title: 'Manual quality assurance processes',
        description: 'QA is entirely manual with no automated checks for consistency or terminology.',
        severity: 'CRITICAL',
        category: 'WORKFLOW_AUTOMATION',
        impact: 'High error rate and slow turnaround on large projects.',
        recommendation: 'Adopt automated QA tools such as XBench or integrate TAUS DQF.',
        effortHours: 80,
        costSavingsEst: 60000,
        status: 'RESOLVED',
      },
      {
        auditId: audit1.id,
        title: 'Underutilized translation memory',
        description: 'Translation memory leverage is below 25% due to poor maintenance.',
        severity: 'MEDIUM',
        category: 'DATA_QUALITY',
        impact: 'Increased costs and longer delivery times for repetitive content.',
        recommendation: 'Dedicate a team to clean and maintain TM databases quarterly.',
        effortHours: 60,
        costSavingsEst: 20000,
        status: 'OPEN',
      },
      {
        auditId: audit2.id,
        title: 'Scheduling system lacks automation',
        description: 'Interpreter scheduling relies on spreadsheets and manual emails.',
        severity: 'HIGH',
        category: 'PROCESS_EFFICIENCY',
        impact: 'Average booking time is 4+ hours, causing interpreter and client frustration.',
        recommendation: 'Deploy a scheduling platform like ScheduleFlex or build a custom solution.',
        effortHours: 200,
        costSavingsEst: 80000,
        status: 'IN_PROGRESS',
      },
      {
        auditId: audit2.id,
        title: 'No real-time availability dashboard',
        description: 'Interpreters availability is not tracked in real time.',
        severity: 'MEDIUM',
        category: 'TOOLING',
        impact: 'Double bookings and last-minute cancellations are frequent.',
        recommendation: 'Implement a real-time availability tracker with calendar sync.',
        effortHours: 90,
        costSavingsEst: 25000,
        status: 'OPEN',
      },
      {
        auditId: audit2.id,
        title: 'Rate negotiation is ad hoc',
        description: 'No standard rate card or automated billing for interpretation services.',
        severity: 'LOW',
        category: 'COST_OPTIMIZATION',
        impact: 'Revenue leakage due to inconsistent pricing.',
        recommendation: 'Create a standardized rate card and automate invoicing.',
        effortHours: 40,
        costSavingsEst: 15000,
        status: 'OPEN',
      },
      {
        auditId: audit3.id,
        title: 'CAT tool version fragmentation',
        description: 'Multiple teams use different versions of SDL Trados and memoQ, causing file compatibility issues.',
        severity: 'HIGH',
        category: 'TOOLING',
        impact: 'Frequent file conversion errors and rework.',
        recommendation: 'Standardize on a single tool version and enforce via company policy.',
        effortHours: 50,
        costSavingsEst: 12000,
        status: 'IN_PROGRESS',
      },
      {
        auditId: audit3.id,
        title: 'Limited workflow automation',
        description: 'File handoff between project managers and linguists is manual.',
        severity: 'MEDIUM',
        category: 'WORKFLOW_AUTOMATION',
        impact: 'Project kickoff takes an average of one day.',
        recommendation: 'Implement an automated handoff using a TMS like Smartling or Crowdin.',
        effortHours: 150,
        costSavingsEst: 35000,
        status: 'OPEN',
      },
      {
        auditId: audit3.id,
        title: 'No API integrations with client systems',
        description: 'Clients cannot submit content directly via API.',
        severity: 'MEDIUM',
        category: 'AI_READINESS',
        impact: 'Manual file uploads slow down onboarding.',
        recommendation: 'Expose a REST API for content submission and status tracking.',
        effortHours: 180,
        costSavingsEst: 30000,
        status: 'OPEN',
      },
      {
        auditId: audit4.id,
        title: 'High per-word costs for post-editing',
        description: 'Full post-editing rates are charged even when MT output quality is high.',
        severity: 'HIGH',
        category: 'COST_OPTIMIZATION',
        impact: 'Clients are overpaying for light post-editing work.',
        recommendation: 'Introduce a light post-editing tier with reduced rates for high-confidence MT.',
        effortHours: 30,
        costSavingsEst: 55000,
        status: 'OPEN',
      },
      {
        auditId: audit4.id,
        title: 'Duplicate vendor payments',
        description: 'No system to detect duplicate invoices from the same linguist.',
        severity: 'INFO',
        category: 'DATA_QUALITY',
        impact: '2% overpayment on vendor invoices.',
        recommendation: 'Implement duplicate invoice detection in the finance system.',
        effortHours: 20,
        costSavingsEst: 8000,
        status: 'OPEN',
      },
    ],
  });

  await prisma.report.create({
    data: {
      auditId: audit1.id,
      summary: 'GlobalTrans demonstrates strong fundamentals but requires significant investment in AI infrastructure and workflow automation to remain competitive. The audit identified 3 critical and high-severity findings that together represent a potential annual savings of $125,000.',
      score: 62.5,
      strengths: JSON.stringify([
        'Strong linguist network with 500+ professionals',
        'Established client relationships across multiple industries',
        'Good baseline translation memory assets',
      ]),
      weaknesses: JSON.stringify([
        'No AI/ML training data pipeline',
        'Manual QA processes causing delays',
        'Poor TM maintenance and leverage',
      ]),
      recommendations: JSON.stringify([
        'Build a bilingual data pipeline within 6 months',
        'Adopt automated QA tools immediately',
        'Launch TM clean-up project within 90 days',
        'Begin AI readiness training for project managers',
      ]),
      generatedAt: new Date('2025-03-01'),
    },
  });

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
