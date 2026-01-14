import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SubmitAnswerDto {
  @ApiProperty({ description: '설문 응답 데이터 (JSON)' })
  @IsNotEmpty()
  answers: any;
}
