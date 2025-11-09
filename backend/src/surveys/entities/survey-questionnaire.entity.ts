import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Survey } from './survey.entity';

@Entity('survey_questionnaires')
export class SurveyQuestionnaire {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'survey_id', unique: true })
  surveyId: string;

  @Column({ name: 'questions_structure', type: 'jsonb' })
  questionsStructure: any; // JSON 구조로 문항 정보 저장

  @Column({ name: 'total_questions', nullable: true })
  totalQuestions: number;

  @Column({ name: 'file_path', nullable: true })
  filePath: string;

  @Column({ name: 'file_name', nullable: true })
  fileName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => Survey, (survey) => survey.questionnaire)
  @JoinColumn({ name: 'survey_id' })
  survey: Survey;
}
