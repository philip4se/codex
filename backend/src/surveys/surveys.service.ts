import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './entities/survey.entity';
import { SurveyQuestionnaire } from './entities/survey-questionnaire.entity';
import { SurveyTargetCondition } from './entities/survey-target-condition.entity';
import { SurveyReward } from '../rewards/entities/survey-reward.entity';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';

@Injectable()
export class SurveysService {
  constructor(
    @InjectRepository(Survey)
    private surveysRepository: Repository<Survey>,
    @InjectRepository(SurveyQuestionnaire)
    private questionnairesRepository: Repository<SurveyQuestionnaire>,
    @InjectRepository(SurveyTargetCondition)
    private targetConditionsRepository: Repository<SurveyTargetCondition>,
    @InjectRepository(SurveyReward)
    private rewardsRepository: Repository<SurveyReward>,
  ) {}

  async create(creatorId: string, createSurveyDto: CreateSurveyDto): Promise<Survey> {
    // 설문 생성
    const survey = this.surveysRepository.create({
      creatorId,
      title: createSurveyDto.title,
      description: createSurveyDto.description,
      purpose: createSurveyDto.purpose,
      startDate: new Date(createSurveyDto.startDate),
      endDate: new Date(createSurveyDto.endDate),
      targetResponseCount: createSurveyDto.targetResponseCount || 100,
      estimatedDuration: createSurveyDto.estimatedDuration,
      googleSheetUrl: createSurveyDto.googleSheetUrl,
      googleFormUrl: createSurveyDto.googleFormUrl,
      status: 'draft',
    });

    const savedSurvey = await this.surveysRepository.save(survey);

    // 설문지 구조 저장
    if (createSurveyDto.questionsStructure) {
      await this.questionnairesRepository.save({
        surveyId: savedSurvey.id,
        questionsStructure: createSurveyDto.questionsStructure,
        totalQuestions: Array.isArray(createSurveyDto.questionsStructure)
          ? createSurveyDto.questionsStructure.length
          : 0,
      });
    }

    // 타깃 조건 저장
    if (createSurveyDto.targetCondition) {
      await this.targetConditionsRepository.save({
        surveyId: savedSurvey.id,
        ...createSurveyDto.targetCondition,
      });
    }

    // 보상 정보 저장
    if (createSurveyDto.reward) {
      await this.rewardsRepository.save({
        surveyId: savedSurvey.id,
        ...createSurveyDto.reward,
      });
    }

    return this.findOne(savedSurvey.id);
  }

  async findAll(userId?: string): Promise<Survey[]> {
    const query = this.surveysRepository
      .createQueryBuilder('survey')
      .leftJoinAndSelect('survey.questionnaire', 'questionnaire')
      .leftJoinAndSelect('survey.targetCondition', 'targetCondition')
      .leftJoinAndSelect('survey.reward', 'reward')
      .leftJoinAndSelect('survey.creator', 'creator')
      .orderBy('survey.createdAt', 'DESC');

    if (userId) {
      query.where('survey.creatorId = :userId', { userId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Survey> {
    const survey = await this.surveysRepository.findOne({
      where: { id },
      relations: ['questionnaire', 'targetCondition', 'reward', 'creator'],
    });

    if (!survey) {
      throw new NotFoundException('설문을 찾을 수 없습니다.');
    }

    return survey;
  }

  async update(id: string, userId: string, updateSurveyDto: UpdateSurveyDto): Promise<Survey> {
    const survey = await this.findOne(id);

    // 권한 확인
    if (survey.creatorId !== userId) {
      throw new ForbiddenException('설문을 수정할 권한이 없습니다.');
    }

    // 기본 정보 수정
    Object.assign(survey, {
      title: updateSurveyDto.title,
      description: updateSurveyDto.description,
      purpose: updateSurveyDto.purpose,
      startDate: updateSurveyDto.startDate ? new Date(updateSurveyDto.startDate) : survey.startDate,
      endDate: updateSurveyDto.endDate ? new Date(updateSurveyDto.endDate) : survey.endDate,
      targetResponseCount: updateSurveyDto.targetResponseCount,
      estimatedDuration: updateSurveyDto.estimatedDuration,
      googleSheetUrl: updateSurveyDto.googleSheetUrl,
      googleFormUrl: updateSurveyDto.googleFormUrl,
    });

    await this.surveysRepository.save(survey);

    // 타깃 조건 수정
    if (updateSurveyDto.targetCondition) {
      await this.targetConditionsRepository.update(
        { surveyId: id },
        updateSurveyDto.targetCondition,
      );
    }

    // 보상 정보 수정
    if (updateSurveyDto.reward) {
      await this.rewardsRepository.update({ surveyId: id }, updateSurveyDto.reward);
    }

    return this.findOne(id);
  }

  async updateStatus(id: string, userId: string, status: string): Promise<Survey> {
    const survey = await this.findOne(id);

    if (survey.creatorId !== userId) {
      throw new ForbiddenException('설문을 수정할 권한이 없습니다.');
    }

    survey.status = status;
    await this.surveysRepository.save(survey);

    return survey;
  }

  async delete(id: string, userId: string): Promise<void> {
    const survey = await this.findOne(id);

    if (survey.creatorId !== userId) {
      throw new ForbiddenException('설문을 삭제할 권한이 없습니다.');
    }

    await this.surveysRepository.delete(id);
  }
}
