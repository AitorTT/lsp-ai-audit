import { AuditScope, AuditStatus, FindingSeverity } from "./enums";

export const AUDIT_STATUS_FLOW: Record<AuditStatus, AuditStatus[]> = {
  [AuditStatus.DRAFT]: [AuditStatus.IN_PROGRESS],
  [AuditStatus.IN_PROGRESS]: [AuditStatus.REVIEW],
  [AuditStatus.REVIEW]: [AuditStatus.COMPLETED, AuditStatus.IN_PROGRESS],
  [AuditStatus.COMPLETED]: [AuditStatus.ARCHIVED],
  [AuditStatus.ARCHIVED]: [],
};

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
} as const;

export const SEVERITY_WEIGHTS: Record<FindingSeverity, number> = {
  [FindingSeverity.CRITICAL]: 5,
  [FindingSeverity.HIGH]: 4,
  [FindingSeverity.MEDIUM]: 3,
  [FindingSeverity.LOW]: 2,
  [FindingSeverity.INFO]: 1,
};

export const AUDIT_SCOPES: AuditScope[] = Object.values(AuditScope);
