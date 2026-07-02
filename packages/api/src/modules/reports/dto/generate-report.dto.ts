import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GenerateReportDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  auditId: string;

  @ApiProperty({ enum: ["PDF", "JSON", "HTML"] })
  @IsEnum(["PDF", "JSON", "HTML"] as const)
  format: "PDF" | "JSON" | "HTML";
}
