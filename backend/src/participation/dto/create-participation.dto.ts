import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional } from 'class-validator';

export class CreateParticipationDto {
  @ApiProperty()
  @IsUUID()
  surveyId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  answers?: any;
}
