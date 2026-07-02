import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole, AuditStatus } from "@lsp/shared";
import { AuditsService } from "./audits.service";
import { CreateAuditDto } from "./dto/create-audit.dto";
import { UpdateAuditDto } from "./dto/update-audit.dto";
import { AuditQueryDto } from "./dto/audit-query.dto";
import { CreateFindingDto } from "./dto/create-finding.dto";
import { UpdateFindingDto } from "./dto/update-finding.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Audits")
@ApiBearerAuth()
@Controller("audits")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditsController {
  constructor(private readonly auditsService: AuditsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAuditDto, @CurrentUser() user: any) {
    return this.auditsService.create(dto, user.id);
  }

  @Get()
  async findAll(@Query() query: AuditQueryDto) {
    return this.auditsService.findAll(query);
  }

  @Get("metrics")
  async getMetrics() {
    return this.auditsService.getMetrics();
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.auditsService.findById(id);
  }

  @Put(":id")
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT)
  async update(@Param("id") id: string, @Body() dto: UpdateAuditDto) {
    return this.auditsService.update(id, dto);
  }

  @Patch(":id/status")
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT)
  async updateStatus(
    @Param("id") id: string,
    @Body("status") status: AuditStatus,
  ) {
    return this.auditsService.updateStatus(id, status);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    await this.auditsService.remove(id);
  }

  @Post(":id/findings")
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT)
  @HttpCode(HttpStatus.CREATED)
  async addFinding(@Param("id") id: string, @Body() dto: CreateFindingDto) {
    return this.auditsService.addFinding(id, dto);
  }

  @Put("findings/:id")
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT)
  async updateFinding(@Param("id") id: string, @Body() dto: UpdateFindingDto) {
    return this.auditsService.updateFinding(id, dto);
  }

  @Delete("findings/:id")
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFinding(@Param("id") id: string) {
    await this.auditsService.removeFinding(id);
  }
}
