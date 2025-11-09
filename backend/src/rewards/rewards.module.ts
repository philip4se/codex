import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { SurveyReward } from './entities/survey-reward.entity';
import { SurveyParticipation } from '../participation/entities/survey-participation.entity';
import { ContactExport } from './entities/contact-export.entity';
import { Survey } from '../surveys/entities/survey.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SurveyReward,
      SurveyParticipation,
      ContactExport,
      Survey,
    ]),
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}
