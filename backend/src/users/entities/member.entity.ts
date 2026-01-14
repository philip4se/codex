import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { Survey } from '../../surveys/entities/survey.entity';
import { SurveyParticipation } from '../../participation/entities/survey-participation.entity';
import { Consent } from './consent.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  name: string;

  @Column({ unique: true })
  phone: string;

  @Column({ name: 'phone_verified', default: false })
  phoneVerified: boolean;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ default: 'active' })
  status: string; // active, suspended, deleted

  @Column({ default: 'user' })
  role: string; // user, admin

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  // Relations
  @OneToOne(() => Profile, (profile) => profile.member)
  profile: Profile;

  @OneToMany(() => Survey, (survey) => survey.creator)
  createdSurveys: Survey[];

  @OneToMany(() => SurveyParticipation, (participation) => participation.participant)
  participations: SurveyParticipation[];

  @OneToMany(() => Consent, (consent) => consent.member)
  consents: Consent[];
}
