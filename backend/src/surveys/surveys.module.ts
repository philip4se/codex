import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { Survey } from './entities/survey.entity';
import { SurveyQuestionnaire } from './entities/survey-questionnaire.entity';
import { SurveyTargetCondition } from './entities/survey-target-condition.entity';
import { SurveyReward } from '../rewards/entities/survey-reward.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Survey,
      SurveyQuestionnaire,
      SurveyTargetCondition,
      SurveyReward,
    ]),
  ],
  controllers: [SurveysController],
  providers: [SurveysService],
  exports: [SurveysService],
})
export class SurveysModule {}
