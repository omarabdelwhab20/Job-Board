import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UploadFileService } from 'src/upload/upload.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    private readonly jwtService: JwtService,

    private readonly uploadFileService: UploadFileService,
  ) {}

  async signUp(signUpDto: SignUpDto, logo: Express.Multer.File) {
    const companyFound = await this.companyRepository.findOneBy({
      email: signUpDto.email,
    });

    if (companyFound) {
      throw new HttpException(
        'Company with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    const newCompany = await this.companyRepository.create({
      ...signUpDto,
      password: hashedPassword,
    });

    const { url, publicId } =
      await this.uploadFileService.uploadCompanyLogo(logo);

    newCompany.logoUrl = url;
    newCompany.logoPublicId = publicId;

    await this.companyRepository.save(newCompany);

    return {
      status: HttpStatus.CREATED,
      message: 'Company created successfully',
    };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const isFound = await this.companyRepository.findOneBy({ email });

    if (!isFound) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordCompared = await bcrypt.compare(password, isFound.password);

    if (!passwordCompared) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = await this.jwtService.signAsync(
      {
        id: isFound.id,
        email: isFound.email,
        role: isFound.role,
      },
      { secret: process.env.JWT_SECRET },
    );

    return {
      status: HttpStatus.OK,
      message: 'Login successfull',
      token,
    };
  }
}
