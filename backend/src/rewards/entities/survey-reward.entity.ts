import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Survey } from '../../surveys/entities/survey.entity';

@Entity('survey_rewards')
export class SurveyReward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'survey_id', unique: true })
  surveyId: string;

  @Column({ name: 'reward_type', nullable: true })
  rewardType: string; // gifticon, mobile_voucher, point, none

  @Column({ name: 'reward_name', nullable: true })
  rewardName: string;

  @Column({ name: 'reward_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  rewardAmount: number;

  @Column({ name: 'total_recipients', default: 0 })
  totalRecipients: number;

  @Column({ name: 'distributed_count', default: 0 })
  distributedCount: number;

  @Column({ name: 'distribution_condition', nullable: true })
  distributionCondition: string; // all_questions, specific_question

  @Column({ name: 'condition_details', type: 'jsonb', nullable: true })
  conditionDetails: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => Survey, (survey) => survey.reward)
  @JoinColumn({ name: 'survey_id' })
  survey: Survey;
}
