import { Company } from 'src/company/entities/company.entity';
import { Recruiter } from 'src/recruiter/entities/recruiter.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum EmploymentType {
  PART_TIME = 'part-time',
  FULL_TIME = 'full-time',
  INTERNSHIP = 'internship',
}

export enum ContractType {
  ON_SITE = 'on-site',
  REMOTE = 'remote',
}

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME,
  })
  employmentType: EmploymentType;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  jobStatus: Status;

  @Column({
    type: 'enum',
    enum: ContractType,
  })
  contractType: ContractType;

  @Column({
    type: 'decimal',
    nullable: false,
  })
  salary: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  location: string;

  @ManyToOne(() => Company, (compnay) => compnay.jobs, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.jobs)
  recruiter: Recruiter;

  @CreateDateColumn()
  createdAt: Date;
}
