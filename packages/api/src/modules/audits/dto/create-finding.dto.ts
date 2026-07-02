import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { FindingSeverity, FindingCategory } from "@lsp/shared";

export class CreateFindingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: FindingSeverity })
  @IsEnum(FindingSeverity)
  severity: FindingSeverity;

  @ApiProperty({ enum: FindingCategory })
  @IsEnum(FindingCategory)
  category: FindingCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  impact?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recommendation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  effortHours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  costSavingsEst?: number;
}
