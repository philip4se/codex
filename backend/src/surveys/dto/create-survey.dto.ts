import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

class TargetConditionDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  minAge?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  maxAge?: number;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  targetCountries?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  targetProvinces?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  targetCities?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  targetDistricts?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  targetOccupations?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsOptional()
  targetGenders?: string[];
}

class RewardDto {
  @ApiProperty({ required: false, enum: ['gifticon', 'mobile_voucher', 'point', 'none'] })
  @IsEnum(['gifticon', 'mobile_voucher', 'point', 'none'])
  @IsOptional()
  rewardType?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  rewardName?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  rewardAmount?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  totalRecipients?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  distributionCondition?: string;
}

export class CreateSurveyDto {
  @ApiProperty({ example: '온라인 쇼핑 만족도 조사' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  purpose?: string;

  @ApiProperty({ example: '2024-12-01T00:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ required: false, default: 100 })
  @IsNumber()
  @IsOptional()
  targetResponseCount?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  estimatedDuration?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  googleSheetUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  googleFormUrl?: string;

  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => TargetConditionDto)
  @IsOptional()
  targetCondition?: TargetConditionDto;

  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => RewardDto)
  @IsOptional()
  reward?: RewardDto;

  @ApiProperty({ required: false })
  @IsOptional()
  questionsStructure?: any;
}
