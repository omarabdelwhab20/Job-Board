import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { Repository } from 'typeorm';
import { User } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordtDto } from './dto/reset-password.dto';
import { Candidate } from 'src/candidate/entities/candidate.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,

    private readonly mailerService: MailerService,

    private readonly jwtService: JwtService,
  ) {}
  async sendVerificationLink(email: string, token: string) {
    const verificationLink = `http://localhost:3000/auth/verify-email/${token}`;

    const htmlMessage = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Chat Application!</h2>
        <p>Please verify your email by clicking the button below:</p>
        <a 
          href="${verificationLink}" 
          style="display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;"
        >
          Verify Email
        </a>
        <p style="margin-top: 20px; color: #666;">
          This link will expire in 24 hours. If you didn't request this, please ignore this email.
        </p>
      </div>`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email',
      html: htmlMessage,
    });
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, password, role } = signUpDto;

    const isFound = await this.userRepository.findOneBy({ email });

    if (isFound) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationLink = crypto.randomBytes(32).toString('hex');

    const newUser = await this.userRepository.create({
      ...signUpDto,
      verificationLink,
      password: hashedPassword,
    });

    await this.userRepository.manager.transaction(async (manager) => {
      await manager.save(newUser);
      await this.sendVerificationLink(email, verificationLink);
      if (role === 'candidate') {
        const candidate = this.candidateRepository.create({
          id: newUser.id,
          user: newUser,
        });
        await manager.save(candidate);
      }
    });

    return {
      status: HttpStatus.OK,
      message:
        'You successfully created an account , check your email to verify',
    };
  }

  async verifyEmail(token: string) {
    const isValid = await this.userRepository.findOneBy({
      verificationLink: token,
    });

    if (!isValid) {
      throw new HttpException('Invalid Token', HttpStatus.BAD_REQUEST);
    }

    if (isValid.isVerified) {
      throw new HttpException('Email already verified', HttpStatus.BAD_REQUEST);
    }

    isValid.isVerified = true;
    isValid.verificationLink = null;

    await this.userRepository.save(isValid);

    return {
      status: HttpStatus.OK,
      message: 'User verification succeeded',
    };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const isFound = await this.userRepository.findOneBy({ email });

    if (!isFound) {
      throw new HttpException('Invalid email or password', HttpStatus.OK);
    }

    const isCorrect = await bcrypt.compare(password, isFound.password);

    if (!isCorrect) {
      throw new HttpException('Invalid email or password', HttpStatus.OK);
    }

    const token = await this.jwtService.signAsync({
      id: isFound.id,
      email: isFound.email,
      name: isFound.userName,
      role: isFound.role,
    });

    return {
      status: HttpStatus.OK,
      token,
      message: 'Login successfull',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordtDto) {
    const { email } = resetPasswordDto;

    const isFound = await this.userRepository.findOneBy({ email });

    if (!isFound) {
      throw new HttpException(
        'IF this email is registered check the inbox to reset your password',
        HttpStatus.OK,
      );
    }

    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');

    isFound.resetPasswordCode = code;
    isFound.resetPasswordCodeExpire = new Date(Date.now() + 10 * 60 * 1000);

    await this.userRepository.save(isFound);

    const htmlMessage = `
    <div>
      <h1>Forgot your password? if you didnt forget your password then ignore this link</h1>
      <p>Use the following code to verify your account : <h3  font-weight : bold ; text-align: center ">${code} </h3></p>
      <h6 style ="font-weight : bold">Ecommerce-NestJs </h6>
    </div>
    `;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password',
      html: htmlMessage,
    });

    return {
      status: HttpStatus.OK,
      message: 'Check your email to reset your password',
    };
  }

  async verifyCode(verifyCodeDto: VerifyCodeDto) {
    const { code, email } = verifyCodeDto;

    const isFound = await this.userRepository.findOneBy({ email });

    if (!isFound) {
      throw new HttpException('Something bad happened', HttpStatus.BAD_REQUEST);
    }

    if (
      isFound.resetPasswordCode !== code ||
      isFound.resetPasswordCodeExpire < new Date()
    ) {
      throw new HttpException('Invalid Code', HttpStatus.BAD_REQUEST);
    }

    isFound.resetPasswordCode = null;
    isFound.resetPasswordCodeExpire = null;

    return {
      status: HttpStatus.OK,
      message: 'Valid Code',
    };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { newPassword, email } = changePasswordDto;

    const isFound = await this.userRepository.findOneBy({ email });

    if (!isFound) {
      throw new HttpException('Something bad happened', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    isFound.password = hashedPassword;

    await this.userRepository.save(isFound);

    return {
      status: HttpStatus.OK,
      message: 'Password changed successfully',
    };
  }
}
