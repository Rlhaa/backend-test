import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  async findByUsername(username: string) {
    return this.authRepository.findOne({ where: { username } });
  }

  async saveUser(data: {
    username: string;
    password: string;
    nickname: string;
  }) {
    const user = this.authRepository.create(data);
    return await this.authRepository.save(user);
  }
}
