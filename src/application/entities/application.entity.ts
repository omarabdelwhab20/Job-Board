import { Candidate } from 'src/candidate/entities/candidate.entity';
import { Job } from 'src/job/entities/job.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ApplicationStatus {
  REVIEWING = 'reviewing',
  APPLIED = 'applied',
  REJECTED = 'rejected',
}

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Candidate)
  candidate: Candidate;

  @ManyToOne(() => Job)
  job: Job;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  resumeUrl: string;

  @Column({
    type: 'varchar',
    enum: ApplicationStatus,
    default: ApplicationStatus.REVIEWING,
  })
  status: ApplicationStatus;

  @CreateDateColumn()
  appliedAt: Date;
}
