import { User } from 'src/auth/entities/auth.entity';
import { Company } from 'src/company/entities/company.entity';
import { Job } from 'src/job/entities/job.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Recruiter {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn({ name: 'id' })
  user: User;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  summary: string;

  @ManyToOne(() => Company, (company) => company.recruiters)
  company: Company;

  @OneToMany(() => Job , (job) => job.recruiter)
  jobs : Job[]

  @Column({
    type: 'varchar',
    nullable: true,
  })
  position: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
