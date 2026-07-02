import { PartialType } from "@nestjs/swagger";
import { IsOptional, IsEnum } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { AuditStatus } from "@lsp/shared";
import { CreateAuditDto } from "./create-audit.dto";

export class UpdateAuditDto extends PartialType(CreateAuditDto) {
  @ApiPropertyOptional({ enum: AuditStatus })
  @IsOptional()
  @IsEnum(AuditStatus)
  status?: AuditStatus;
}
