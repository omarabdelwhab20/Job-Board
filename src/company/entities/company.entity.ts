import { Candidate } from 'src/candidate/entities/candidate.entity';
import { Recruiter } from 'src/recruiter/entities/recruiter.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Url } from 'url';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  logoUrl: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  logoPublicId: string;

  @Column({
    type: 'varchar',
    default: 'company',
  })
  role: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  website: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  location: string;

  @OneToMany(() => Recruiter, (recruiter) => recruiter.company, { eager: true })
  recruiters: Recruiter[];

  @OneToMany(() => Candidate, (candidate) => candidate.company, { eager: true })
  candidates: Candidate[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
