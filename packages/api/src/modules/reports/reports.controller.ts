import { Controller, Get, Post, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@lsp/shared";
import { ReportsService } from "./reports.service";
import { GenerateReportDto } from "./dto/generate-report.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@ApiTags("Reports")
@ApiBearerAuth()
@Controller("reports")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post("generate")
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT)
  @HttpCode(HttpStatus.CREATED)
  async generate(@Body() dto: GenerateReportDto) {
    return this.reportsService.generate(dto.auditId, dto.format);
  }

  @Get("audit/:auditId")
  async findByAuditId(@Param("auditId") auditId: string) {
    return this.reportsService.findByAuditId(auditId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Query() query: { page?: number; limit?: number }) {
    return this.reportsService.findAll(query);
  }

  @Get("audit/:auditId/score-summary")
  async getScoreSummary(@Param("auditId") auditId: string) {
    return this.reportsService.getScoreSummary(auditId);
  }
}
