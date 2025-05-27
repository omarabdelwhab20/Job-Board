/*import { User } from 'src/auth/entities/auth.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';


@Entity()
export class Recruiter {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Company, (company) => company.recruiters)
  company: Company;


  @Column({
    type : 'varchar',
    nullable : false
  })
  position : string


  @CreateDateColumn()
  createdAt : Date

  @UpdateDateColumn()
  updatedAt : Date
}
*/
