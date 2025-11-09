import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ParticipationService } from './participation.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('participation')
@Controller('participation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

  @Get('matched-surveys')
  @ApiOperation({ summary: '나에게 맞는 설문 목록 조회' })
  async getMatchedSurveys(@CurrentUser() user: any) {
    return this.participationService.getMatchedSurveys(user.userId);
  }

  @Post('start')
  @ApiOperation({ summary: '설문 참여 시작' })
  async startParticipation(
    @CurrentUser() user: any,
    @Body() createParticipationDto: CreateParticipationDto,
  ) {
    return this.participationService.startParticipation(
      user.userId,
      createParticipationDto,
    );
  }

  @Post(':surveyId/submit')
  @ApiOperation({ summary: '설문 응답 제출' })
  async submitAnswer(
    @CurrentUser() user: any,
    @Param('surveyId') surveyId: string,
    @Body() submitAnswerDto: SubmitAnswerDto,
  ) {
    return this.participationService.submitAnswer(
      user.userId,
      surveyId,
      submitAnswerDto,
    );
  }

  @Get('my-participations')
  @ApiOperation({ summary: '내 참여 이력 조회' })
  async getMyParticipations(@CurrentUser() user: any) {
    return this.participationService.getMyParticipations(user.userId);
  }

  @Get('survey/:surveyId/participants')
  @ApiOperation({ summary: '설문별 참여자 목록 조회 (의뢰자용)' })
  async getParticipantsBySurvey(
    @Param('surveyId') surveyId: string,
    @CurrentUser() user: any,
  ) {
    return this.participationService.getParticipantsBySurvey(
      surveyId,
      user.userId,
    );
  }
}
