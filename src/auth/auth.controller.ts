import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtExceptionFilter } from './jwt-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    schema: {
      example: {
        username: 'JIN HO',
        nickname: 'Mentos',
      },
    },
  })
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const { username, password, nickname } = signupDto;
    return await this.authService.createUser(username, password, nickname);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: '로그인 성공 (JWT 토큰 반환)',
    schema: {
      example: {
        token: 'eKDIkdfjoakIdkfjpekdkcjdkoIOdjOKJDFOlLDKFJKL',
      },
    },
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    const token = await this.authService.validateLogin(username, password);
    return token;
  }

  @UseGuards(JwtAuthGuard)
  @UseFilters(JwtExceptionFilter)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 정보 조회 (토큰 인증 필요)' })
  @ApiResponse({
    status: 200,
    description: '인증 성공 - 사용자 정보 반환',
    schema: {
      example: {
        id: 1,
      },
    },
  })
  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }
}
