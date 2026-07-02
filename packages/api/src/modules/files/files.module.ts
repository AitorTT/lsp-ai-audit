import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";
import { multerOptions } from "./multer.config";

@Module({
  imports: [MulterModule.register(multerOptions)],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
