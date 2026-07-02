import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  Res,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { UserRole } from "@lsp/shared";
import { FilesService } from "./files.service";
import { FileQueryDto } from "./dto/file-query.dto";
import { multerOptions } from "./multer.config";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Files")
@ApiBearerAuth()
@Controller("files")
@UseGuards(JwtAuthGuard, RolesGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CONSULTANT)
  @UseInterceptors(FileInterceptor("file", multerOptions))
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
        auditId: { type: "string" },
        findingId: { type: "string" },
      },
    },
  })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
    @Query("auditId") auditId?: string,
    @Query("findingId") findingId?: string,
  ) {
    return this.filesService.upload(file, user.id, auditId, findingId);
  }

  @Get()
  async findAll(@Query() query: FileQueryDto) {
    return this.filesService.findAll(query);
  }

  @Get("usage")
  @Roles(UserRole.ADMIN)
  async getDiskUsage() {
    return this.filesService.getDiskUsage();
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.filesService.findById(id);
  }

  @Get(":id/download")
  async download(@Param("id") id: string, @Res() res: Response) {
    const { stream, file } = await this.filesService.getFileStream(id);
    res.set({
      "Content-Type": file.mimeType,
      "Content-Disposition": `attachment; filename="${file.originalName}"`,
      "Content-Length": file.size.toString(),
    });
    stream.pipe(res);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string) {
    return this.filesService.remove(id);
  }
}
