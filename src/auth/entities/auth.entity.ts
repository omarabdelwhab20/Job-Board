import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  RECRUITER = 'recruiter',
  CANDIDATE = 'candidate',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  userName: string;
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
    nullable: true,
  })
  phone?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  profilePictureUrl: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @Index()
  profilePicturePublicId: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  location?: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isVerified: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  verificationLink: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  resetPasswordCode: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  resetPasswordCodeExpire: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
