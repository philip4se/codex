import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('occupations')
export class Occupation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  category: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Occupation, (occupation) => occupation.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Occupation;

  @OneToMany(() => Occupation, (occupation) => occupation.parent)
  children: Occupation[];
}
