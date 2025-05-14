import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async createUser(username: string, password: string, nickname: string) {
    const existingUser = await this.authRepository.findByUsername(username);

    if (existingUser) {
      return {
        error: {
          code: 'USER_ALREADY_EXISTS',
          message: '이미 가입된 사용자입니다.',
        },
      };
    }

    const hashedPw = await bcrypt.hash(password, 10);
    const user = await this.authRepository.saveUser({
      username,
      password: hashedPw,
      nickname,
    });

    return {
      username: user.username,
      nickname: user.nickname,
    };
  }

  async validateLogin(username: string, password: string) {
    const user = await this.authRepository.findByUsername(username);
    if (!user) {
      return {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '아이디 또는 비밀번호가 올바르지 않습니다.',
        },
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '아이디 또는 비밀번호가 올바르지 않습니다.',
        },
      };
    }

    const payload = { id: user.id };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
