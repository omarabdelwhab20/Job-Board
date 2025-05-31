import { Company } from 'src/company/entities/company.entity';
import { Recruiter } from 'src/recruiter/entities/recruiter.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Status {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'reject',
}

@Entity()
export class RecruiterRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Recruiter, { onDelete: 'CASCADE' })
  recruiter: Recruiter;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  company: Company;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;
}
