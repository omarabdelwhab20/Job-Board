import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('company/')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('sign-up')
  @UseInterceptors(FileInterceptor('logo'))
  signUp(
    @Body() signUpDto: SignUpDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    return this.companyService.signUp(signUpDto, logo);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.companyService.signIn(signInDto);
  }
}
