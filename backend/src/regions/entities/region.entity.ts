import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('regions')
export class Region {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column()
  level: number; // 1: 국가, 2: 광역, 3: 시군구, 4: 읍면동

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Region, (region) => region.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Region;

  @OneToMany(() => Region, (region) => region.parent)
  children: Region[];
}
