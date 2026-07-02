import { AuditScope, AuditStatus, FindingCategory, FindingSeverity, LSPType, UserRole } from "./enums";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  type: LSPType;
  logo?: string;
  website?: string;
  description: string;
  employeeCount: number;
  annualRevenue: number;
  primaryLanguages: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Finding {
  id: string;
  auditId: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  category: FindingCategory;
  impact: string;
  recommendation: string;
  effort_hours: number;
  cost_savings_est: number;
  status: string;
  createdAt: Date;
}

export interface Audit {
  id: string;
  title: string;
  description: string;
  scope: AuditScope;
  status: AuditStatus;
  clientId: string;
  consultantId: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  findings: Finding[];
}

export interface Report {
  id: string;
  auditId: string;
  summary: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  generatedAt: Date;
  format: "PDF" | "JSON" | "HTML";
}

export interface AuditMetrics {
  totalAudits: number;
  completedAudits: number;
  avgScore: number;
  totalCostSavings: number;
  totalEffortHours: number;
  findingsBySeverity: Record<FindingSeverity, number>;
  findingsByCategory: Record<FindingCategory, number>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
