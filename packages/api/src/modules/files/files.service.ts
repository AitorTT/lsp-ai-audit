import { Injectable, NotFoundException, StreamableFile } from "@nestjs/common";
import { createReadStream, existsSync, unlinkSync } from "fs";
import { join } from "path";
import prisma from "@lsp/database";
import { FileQueryDto } from "./dto/file-query.dto";

@Injectable()
export class FilesService {
  async upload(file: Express.Multer.File, userId: string, auditId?: string, findingId?: string) {
    const url = join("uploads", file.filename);
    return prisma.file.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url,
        auditId: auditId || null,
        findingId: findingId || null,
        uploadedById: userId,
      },
    });
  }

  async findAll(query: FileQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.auditId) where.auditId = query.auditId;
    if (query.findingId) where.findingId = query.findingId;

    const [data, total] = await Promise.all([
      prisma.file.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.file.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) {
      throw new NotFoundException("File not found");
    }
    return file;
  }

  async getFileStream(id: string) {
    const file = await this.findById(id);
    const filePath = join(process.cwd(), file.url);

    if (!existsSync(filePath)) {
      throw new NotFoundException("File not found on disk");
    }

    const stream = createReadStream(filePath);
    return { stream, file };
  }

  async remove(id: string) {
    const file = await this.findById(id);
    const filePath = join(process.cwd(), file.url);

    try {
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    } catch {
      // ignore disk errors
    }

    await prisma.file.delete({ where: { id } });
    return { message: "File deleted successfully" };
  }

  async getDiskUsage() {
    const result = await prisma.file.aggregate({
      _sum: { size: true },
    });
    return { totalBytes: result._sum.size || 0 };
  }
}
