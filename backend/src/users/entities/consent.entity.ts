import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Entity('consents')
export class Consent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'member_id' })
  memberId: string;

  @Column({ name: 'consent_type' })
  consentType: string; // terms_of_service, privacy_policy, contact_sharing, marketing

  @Column({ name: 'consent_version', nullable: true })
  consentVersion: string;

  @Column({ default: false })
  agreed: boolean;

  @Column({ name: 'agreed_at', type: 'timestamp', nullable: true })
  agreedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Member, (member) => member.consents)
  @JoinColumn({ name: 'member_id' })
  member: Member;
}
