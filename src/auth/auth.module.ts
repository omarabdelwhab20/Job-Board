import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { CandidateModule } from 'src/candidate/candidate.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => CandidateModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [TypeOrmModule],
})
export class AuthModule {}
