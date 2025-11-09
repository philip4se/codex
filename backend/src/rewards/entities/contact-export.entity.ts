import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Survey } from '../../surveys/entities/survey.entity';
import { Member } from '../../users/entities/member.entity';

@Entity('contact_exports')
export class ContactExport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'survey_id' })
  surveyId: string;

  @Column({ name: 'exporter_id' })
  exporterId: string;

  @Column({ name: 'exported_count' })
  exportedCount: number;

  @Column({ name: 'file_path', nullable: true })
  filePath: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Survey)
  @JoinColumn({ name: 'survey_id' })
  survey: Survey;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'exporter_id' })
  exporter: Member;
}
