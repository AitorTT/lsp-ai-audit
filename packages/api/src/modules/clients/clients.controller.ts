import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@lsp/shared";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { ClientQueryDto } from "./dto/client-query.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Clients")
@ApiBearerAuth()
@Controller("clients")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateClientDto, @CurrentUser() user: any) {
    return this.clientsService.create(dto, user.id);
  }

  @Get()
  async findAll(@Query() query: ClientQueryDto) {
    return this.clientsService.findAll(query);
  }

  @Get("stats")
  async getStats() {
    return this.clientsService.getStats();
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.clientsService.findById(id);
  }

  @Put(":id")
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT)
  async update(@Param("id") id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    await this.clientsService.remove(id);
  }
}
