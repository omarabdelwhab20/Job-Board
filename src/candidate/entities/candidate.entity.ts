import { User } from 'src/auth/entities/auth.entity';
import { Company } from 'src/company/entities/company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
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
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user: User;

  @Column({
    type: 'varchar',
    nullable: true,
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

  @Column({ type: 'jsonb', nullable: true })
  experience: Experience[];

  @ManyToOne(() => Company, (company) => company.candidates, { nullable: true })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
