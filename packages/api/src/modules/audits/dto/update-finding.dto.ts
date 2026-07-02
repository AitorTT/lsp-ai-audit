import { PartialType } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { CreateFindingDto } from "./create-finding.dto";

export class UpdateFindingDto extends PartialType(CreateFindingDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;
}
