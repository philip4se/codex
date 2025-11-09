import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  countryId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  provinceId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  cityId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  districtId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  occupationId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  occupationDetail?: string;

  @ApiProperty({ required: false, enum: ['male', 'female', 'other', 'prefer_not_to_say'] })
  @IsString()
  @IsOptional()
  gender?: string;
}
