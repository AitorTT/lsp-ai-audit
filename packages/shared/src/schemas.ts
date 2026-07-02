import { z } from "zod";
import { AuditScope, AuditStatus, FindingCategory, FindingSeverity, LSPType, UserRole } from "./enums";

export const createAuditSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  scope: z.nativeEnum(AuditScope),
  clientId: z.string().uuid(),
  consultantId: z.string().uuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const updateAuditSchema = createAuditSchema.partial().extend({
  status: z.nativeEnum(AuditStatus).optional(),
});

export const createClientSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(LSPType),
  logo: z.string().optional(),
  website: z.string().url().optional(),
  description: z.string().min(1),
  employeeCount: z.number().int().positive(),
  annualRevenue: z.number().nonnegative(),
  primaryLanguages: z.array(z.string().min(1)).min(1),
});

export const updateClientSchema = createClientSchema.partial();

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole),
  companyId: z.string().uuid().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createFindingSchema = z.object({
  auditId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  severity: z.nativeEnum(FindingSeverity),
  category: z.nativeEnum(FindingCategory),
  impact: z.string().min(1),
  recommendation: z.string().min(1),
  effort_hours: z.number().nonnegative(),
  cost_savings_est: z.number().nonnegative(),
});

export type CreateAuditInput = z.infer<typeof createAuditSchema>;
export type UpdateAuditInput = z.infer<typeof updateAuditSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateFindingInput = z.infer<typeof createFindingSchema>;
