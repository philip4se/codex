import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyReward } from './entities/survey-reward.entity';
import { SurveyParticipation } from '../participation/entities/survey-participation.entity';
import { ContactExport } from './entities/contact-export.entity';
import { Survey } from '../surveys/entities/survey.entity';
import { Member } from '../users/entities/member.entity';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(SurveyReward)
    private rewardsRepository: Repository<SurveyReward>,
    @InjectRepository(SurveyParticipation)
    private participationRepository: Repository<SurveyParticipation>,
    @InjectRepository(ContactExport)
    private contactExportRepository: Repository<ContactExport>,
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
  ) {}

  // 보상 조건 충족자 목록 조회
  async getEligibleParticipants(
    surveyId: string,
    userId: string,
  ): Promise<SurveyParticipation[]> {
    // 설문 소유자 확인
    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId },
    });

    if (!survey) {
      throw new NotFoundException('설문을 찾을 수 없습니다.');
    }

    if (survey.creatorId !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    // 보상 조건 충족자 조회
    return this.participationRepository.find({
      where: {
        surveyId,
        status: 'completed',
        isEligibleForReward: true,
      },
      relations: ['participant'],
      order: { completedAt: 'ASC' },
    });
  }

  // 연락처 엑셀 다운로드
  async exportContacts(surveyId: string, userId: string): Promise<string> {
    const participants = await this.getEligibleParticipants(surveyId, userId);

    // 엑셀 데이터 생성
    const data = participants.map((p, index) => ({
      번호: index + 1,
      이름: p.participant.name,
      전화번호: p.participant.phone,
      이메일: p.participant.email,
      완료일시: p.completedAt,
      보상지급여부: p.rewardDistributed ? '지급완료' : '미지급',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '참여자목록');

    // 파일 저장
    const uploadsDir = path.join(process.cwd(), 'uploads', 'exports');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `survey_${surveyId}_${Date.now()}.xlsx`;
    const filePath = path.join(uploadsDir, fileName);

    XLSX.writeFile(workbook, filePath);

    // 추출 기록 저장
    await this.contactExportRepository.save({
      surveyId,
      exporterId: userId,
      exportedCount: participants.length,
      filePath,
    });

    return filePath;
  }

  // 보상 지급 처리
  async markRewardDistributed(
    surveyId: string,
    participantId: string,
    userId: string,
  ): Promise<SurveyParticipation> {
    // 설문 소유자 확인
    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId },
    });

    if (!survey) {
      throw new NotFoundException('설문을 찾을 수 없습니다.');
    }

    if (survey.creatorId !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    // 참여 기록 조회
    const participation = await this.participationRepository.findOne({
      where: { surveyId, participantId },
    });

    if (!participation) {
      throw new NotFoundException('참여 기록을 찾을 수 없습니다.');
    }

    // 보상 지급 처리
    participation.rewardDistributed = true;
    participation.rewardDistributedAt = new Date();

    return this.participationRepository.save(participation);
  }

  // 보상 통계 조회
  async getRewardStatistics(surveyId: string, userId: string) {
    // 설문 소유자 확인
    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId },
      relations: ['reward'],
    });

    if (!survey) {
      throw new NotFoundException('설문을 찾을 수 없습니다.');
    }

    if (survey.creatorId !== userId) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    const totalEligible = await this.participationRepository.count({
      where: { surveyId, isEligibleForReward: true, status: 'completed' },
    });

    const totalDistributed = await this.participationRepository.count({
      where: { surveyId, rewardDistributed: true },
    });

    return {
      surveyId,
      rewardType: survey.reward?.rewardType,
      rewardName: survey.reward?.rewardName,
      rewardAmount: survey.reward?.rewardAmount,
      totalEligible,
      totalDistributed,
      pending: totalEligible - totalDistributed,
    };
  }
}
