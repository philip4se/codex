import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipationService } from './participation.service';
import { ParticipationController } from './participation.controller';
import { SurveyParticipation } from './entities/survey-participation.entity';
import { Survey } from '../surveys/entities/survey.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Member } from '../users/entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SurveyParticipation, Survey, Profile, Member]),
  ],
  controllers: [ParticipationController],
  providers: [ParticipationService],
  exports: [ParticipationService],
})
export class ParticipationModule {}
