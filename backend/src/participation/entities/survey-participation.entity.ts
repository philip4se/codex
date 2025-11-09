import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Survey } from '../../surveys/entities/survey.entity';
import { Member } from '../../users/entities/member.entity';

@Entity('survey_participations')
@Unique(['surveyId', 'participantId'])
export class SurveyParticipation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'survey_id' })
  surveyId: string;

  @Column({ name: 'participant_id' })
  participantId: string;

  @Column({ default: 'in_progress' })
  status: string; // in_progress, completed, abandoned

  @Column({ name: 'started_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  answers: any; // 응답 데이터

  // 보상 관련
  @Column({ name: 'is_eligible_for_reward', default: false })
  isEligibleForReward: boolean;

  @Column({ name: 'reward_distributed', default: false })
  rewardDistributed: boolean;

  @Column({ name: 'reward_distributed_at', type: 'timestamp', nullable: true })
  rewardDistributedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Survey, (survey) => survey.participations)
  @JoinColumn({ name: 'survey_id' })
  survey: Survey;

  @ManyToOne(() => Member, (member) => member.participations)
  @JoinColumn({ name: 'participant_id' })
  participant: Member;
}
