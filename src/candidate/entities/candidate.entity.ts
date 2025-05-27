import { User } from 'src/auth/entities/auth.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface Experience {
  title: string;
  company: string;
  duration: string;
}

@Entity()
export class Candidate {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  summary: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  resumeUrl: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @Index()
  resumePublicId: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  resumeOriginalName: string;

  @Column('simple-array', { nullable: true })
  skills: string[];

  @Column({ nullable: true })
  experience: Experience;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
