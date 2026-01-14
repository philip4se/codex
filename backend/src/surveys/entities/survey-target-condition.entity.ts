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

@Entity('survey_target_conditions')
export class SurveyTargetCondition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'survey_id', unique: true })
  surveyId: string;

  // 나이 조건
  @Column({ name: 'min_age', nullable: true })
  minAge: number;

  @Column({ name: 'max_age', nullable: true })
  maxAge: number;

  // 지역 조건 (UUID 배열)
  @Column({ name: 'target_countries', type: 'uuid', array: true, nullable: true })
  targetCountries: string[];

  @Column({ name: 'target_provinces', type: 'uuid', array: true, nullable: true })
  targetProvinces: string[];

  @Column({ name: 'target_cities', type: 'uuid', array: true, nullable: true })
  targetCities: string[];

  @Column({ name: 'target_districts', type: 'uuid', array: true, nullable: true })
  targetDistricts: string[];

  // 직업 조건
  @Column({ name: 'target_occupations', type: 'uuid', array: true, nullable: true })
  targetOccupations: string[];

  // 성별 조건
  @Column({ name: 'target_genders', type: 'varchar', array: true, nullable: true })
  targetGenders: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => Survey, (survey) => survey.targetCondition)
  @JoinColumn({ name: 'survey_id' })
  survey: Survey;
}
