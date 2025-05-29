import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { UploadModule } from './upload/upload.module';
import { CandidateModule } from './candidate/candidate.module';
import { RecruiterModule } from './recruiter/recruiter.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      username: 'postgres',
      password: process.env.POSTGRES_PASSWORD,
      database: 'job-board',
      autoLoadEntities: true,
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),

    

    JwtModule.register({
      global : true,
      secret : process.env.JWT_SECRET,
      signOptions : {expiresIn : '12h'}
    }),
    AuthModule,
    UploadModule,
    CandidateModule,
    RecruiterModule,
    CompanyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
