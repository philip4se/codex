import { Controller, Get, Post, Param, UseGuards, Res, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('rewards')
@Controller('rewards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('survey/:surveyId/eligible')
  @ApiOperation({ summary: '보상 조건 충족자 목록 조회' })
  async getEligibleParticipants(
    @Param('surveyId') surveyId: string,
    @CurrentUser() user: any,
  ) {
    return this.rewardsService.getEligibleParticipants(surveyId, user.userId);
  }

  @Get('survey/:surveyId/export')
  @ApiOperation({ summary: '연락처 엑셀 다운로드' })
  async exportContacts(
    @Param('surveyId') surveyId: string,
    @CurrentUser() user: any,
    @Res() res: Response,
  ) {
    const filePath = await this.rewardsService.exportContacts(
      surveyId,
      user.userId,
    );
    res.download(filePath);
  }

  @Post('survey/:surveyId/mark-distributed')
  @ApiOperation({ summary: '보상 지급 처리' })
  async markRewardDistributed(
    @Param('surveyId') surveyId: string,
    @Body('participantId') participantId: string,
    @CurrentUser() user: any,
  ) {
    return this.rewardsService.markRewardDistributed(
      surveyId,
      participantId,
      user.userId,
    );
  }

  @Get('survey/:surveyId/statistics')
  @ApiOperation({ summary: '보상 통계 조회' })
  async getRewardStatistics(
    @Param('surveyId') surveyId: string,
    @CurrentUser() user: any,
  ) {
    return this.rewardsService.getRewardStatistics(surveyId, user.userId);
  }
}
