import { randomUUID } from "crypto";
import { existsSync, mkdirSync } from "fs";
import { extname, join } from "path";
import { diskStorage } from "multer";
import { BadRequestException } from "@nestjs/common";

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
  "text/csv",
  "application/json",
];

const uploadDir = join(process.cwd(), "uploads");

export const multerOptions = {
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException(`Unsupported file type: ${file.mimetype}`), false);
    }
  },
  storage: diskStorage({
    destination: (_req: any, _file: Express.Multer.File, cb: any) => {
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (_req: any, file: Express.Multer.File, cb: any) => {
      const name = randomUUID() + extname(file.originalname);
      cb(null, name);
    },
  }),
};
