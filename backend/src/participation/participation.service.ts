import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyParticipation } from './entities/survey-participation.entity';
import { Survey } from '../surveys/entities/survey.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Member } from '../users/entities/member.entity';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Injectable()
export class ParticipationService {
  constructor(
    @InjectRepository(SurveyParticipation)
    private participationRepository: Repository<SurveyParticipation>,
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  // 사용자에게 맞는 설문 목록 조회 (매칭 로직)
  async getMatchedSurveys(userId: string): Promise<Survey[]> {
    // 사용자 프로필 조회
    const profile = await this.profileRepository.findOne({
      where: { memberId: userId },
    });

    if (!profile) {
      throw new NotFoundException('프로필을 찾을 수 없습니다.');
    }

    // 사용자 나이 계산
    const member = await this.memberRepository.findOne({
      where: { id: userId },
    });
    const birthDate = new Date(member.birthDate);
    const age = Math.floor(
      (Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
    );

    // 매칭 쿼리
    const query = this.surveyRepository
      .createQueryBuilder('survey')
      .leftJoinAndSelect('survey.targetCondition', 'targetCondition')
      .leftJoinAndSelect('survey.reward', 'reward')
      .leftJoinAndSelect('survey.questionnaire', 'questionnaire')
      .where('survey.status = :status', { status: 'recruiting' })
      .andWhere('survey.startDate <= :now', { now: new Date() })
      .andWhere('survey.endDate >= :now', { now: new Date() })
      .andWhere(
        'NOT EXISTS (SELECT 1 FROM survey_participations sp WHERE sp.survey_id = survey.id AND sp.participant_id = :userId AND sp.status = :completedStatus)',
        { userId, completedStatus: 'completed' },
      );

    // 나이 조건
    query.andWhere(
      '(targetCondition.min_age IS NULL OR targetCondition.min_age <= :age)',
      { age },
    );
    query.andWhere(
      '(targetCondition.max_age IS NULL OR targetCondition.max_age >= :age)',
      { age },
    );

    // 지역 조건
    if (profile.countryId) {
      query.andWhere(
        '(targetCondition.target_countries IS NULL OR :countryId = ANY(targetCondition.target_countries))',
        { countryId: profile.countryId },
      );
    }

    if (profile.provinceId) {
      query.andWhere(
        '(targetCondition.target_provinces IS NULL OR :provinceId = ANY(targetCondition.target_provinces))',
        { provinceId: profile.provinceId },
      );
    }

    if (profile.cityId) {
      query.andWhere(
        '(targetCondition.target_cities IS NULL OR :cityId = ANY(targetCondition.target_cities))',
        { cityId: profile.cityId },
      );
    }

    // 직업 조건
    if (profile.occupationId) {
      query.andWhere(
        '(targetCondition.target_occupations IS NULL OR :occupationId = ANY(targetCondition.target_occupations))',
        { occupationId: profile.occupationId },
      );
    }

    // 성별 조건
    if (profile.gender) {
      query.andWhere(
        '(targetCondition.target_genders IS NULL OR :gender = ANY(targetCondition.target_genders))',
        { gender: profile.gender },
      );
    }

    query.orderBy('survey.createdAt', 'DESC');

    return query.getMany();
  }

  // 설문 참여 시작
  async startParticipation(
    userId: string,
    createParticipationDto: CreateParticipationDto,
  ): Promise<SurveyParticipation> {
    const { surveyId } = createParticipationDto;

    // 중복 참여 확인
    const existing = await this.participationRepository.findOne({
      where: { surveyId, participantId: userId },
    });

    if (existing) {
      if (existing.status === 'completed') {
        throw new BadRequestException('이미 완료한 설문입니다.');
      }
      return existing; // 진행 중인 설문 반환
    }

    // 참여 기록 생성
    const participation = this.participationRepository.create({
      surveyId,
      participantId: userId,
      status: 'in_progress',
    });

    return this.participationRepository.save(participation);
  }

  // 설문 응답 제출
  async submitAnswer(
    userId: string,
    surveyId: string,
    submitAnswerDto: SubmitAnswerDto,
  ): Promise<SurveyParticipation> {
    const participation = await this.participationRepository.findOne({
      where: { surveyId, participantId: userId },
    });

    if (!participation) {
      throw new NotFoundException('참여 기록을 찾을 수 없습니다.');
    }

    // 응답 저장 및 완료 처리
    participation.answers = submitAnswerDto.answers;
    participation.status = 'completed';
    participation.completedAt = new Date();
    participation.isEligibleForReward = true; // 보상 조건 충족 (추후 로직 추가 가능)

    const saved = await this.participationRepository.save(participation);

    // 설문 응답 수 증가
    await this.surveyRepository.increment(
      { id: surveyId },
      'currentResponseCount',
      1,
    );

    return saved;
  }

  // 내 참여 이력 조회
  async getMyParticipations(userId: string): Promise<SurveyParticipation[]> {
    return this.participationRepository.find({
      where: { participantId: userId },
      relations: ['survey', 'survey.reward'],
      order: { createdAt: 'DESC' },
    });
  }

  // 설문별 참여자 목록 조회 (의뢰자용)
  async getParticipantsBySurvey(
    surveyId: string,
    creatorId: string,
  ): Promise<SurveyParticipation[]> {
    // 설문 소유자 확인
    const survey = await this.surveyRepository.findOne({
      where: { id: surveyId },
    });

    if (!survey) {
      throw new NotFoundException('설문을 찾을 수 없습니다.');
    }

    if (survey.creatorId !== creatorId) {
      throw new BadRequestException('권한이 없습니다.');
    }

    return this.participationRepository.find({
      where: { surveyId, status: 'completed' },
      relations: ['participant'],
      order: { completedAt: 'DESC' },
    });
  }
}
