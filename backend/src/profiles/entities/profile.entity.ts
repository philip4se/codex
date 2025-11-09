import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Member } from '../../users/entities/member.entity';
import { Region } from '../../regions/entities/region.entity';
import { Occupation } from '../../occupations/entities/occupation.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'member_id', unique: true })
  memberId: string;

  // 지역 정보
  @Column({ name: 'country_id', nullable: true })
  countryId: string;

  @Column({ name: 'province_id', nullable: true })
  provinceId: string;

  @Column({ name: 'city_id', nullable: true })
  cityId: string;

  @Column({ name: 'district_id', nullable: true })
  districtId: string;

  // 직업 정보
  @Column({ name: 'occupation_id', nullable: true })
  occupationId: string;

  @Column({ name: 'occupation_detail', nullable: true })
  occupationDetail: string;

  // 추가 정보
  @Column({ nullable: true })
  gender: string; // male, female, other, prefer_not_to_say

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToOne(() => Member, (member) => member.profile)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @ManyToOne(() => Region)
  @JoinColumn({ name: 'country_id' })
  country: Region;

  @ManyToOne(() => Region)
  @JoinColumn({ name: 'province_id' })
  province: Region;

  @ManyToOne(() => Region)
  @JoinColumn({ name: 'city_id' })
  city: Region;

  @ManyToOne(() => Region)
  @JoinColumn({ name: 'district_id' })
  district: Region;

  @ManyToOne(() => Occupation)
  @JoinColumn({ name: 'occupation_id' })
  occupation: Occupation;
}
