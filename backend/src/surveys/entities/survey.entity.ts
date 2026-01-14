import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Member } from '../../users/entities/member.entity';
import { SurveyQuestionnaire } from './survey-questionnaire.entity';
import { SurveyTargetCondition } from './survey-target-condition.entity';
import { SurveyReward } from '../../rewards/entities/survey-reward.entity';
import { SurveyParticipation } from '../../participation/entities/survey-participation.entity';

@Entity('surveys')
export class Survey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'creator_id' })
  creatorId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  purpose: string;

  @Column({ default: 'draft' })
  status: string; // draft, pending_approval, recruiting, closed, cancelled

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp' })
  endDate: Date;

  @Column({ name: 'target_response_count', default: 0 })
  targetResponseCount: number;

  @Column({ name: 'current_response_count', default: 0 })
  currentResponseCount: number;

  @Column({ name: 'estimated_duration', nullable: true })
  estimatedDuration: number; // 예상 소요 시간 (분)

  @Column({ name: 'google_sheet_url', nullable: true })
  googleSheetUrl: string;

  @Column({ name: 'google_form_url', nullable: true })
  googleFormUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Member, (member) => member.createdSurveys)
  @JoinColumn({ name: 'creator_id' })
  creator: Member;

  @OneToOne(() => SurveyQuestionnaire, (questionnaire) => questionnaire.survey)
  questionnaire: SurveyQuestionnaire;

  @OneToOne(() => SurveyTargetCondition, (condition) => condition.survey)
  targetCondition: SurveyTargetCondition;

  @OneToOne(() => SurveyReward, (reward) => reward.survey)
  reward: SurveyReward;

  @OneToMany(() => SurveyParticipation, (participation) => participation.survey)
  participations: SurveyParticipation[];
}
