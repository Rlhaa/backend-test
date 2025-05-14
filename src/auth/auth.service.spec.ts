import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let repo: AuthRepository;
  let jwt: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: {
            findByUsername: jest.fn(),
            saveUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repo = module.get<AuthRepository>(AuthRepository);
    jwt = module.get<JwtService>(JwtService);
  });

  it('should create a new user successfully', async () => {
    jest.spyOn(repo, 'findByUsername').mockResolvedValue(null);
    jest.spyOn(repo, 'saveUser').mockResolvedValue({
      id: 1,
      username: 'test',
      password: 'hashedpw',
      nickname: 'nick',
    });

    const result = await service.createUser('test', '1234', 'nick');
    expect(result).toEqual({ username: 'test', nickname: 'nick' });
  });

  it('should return error for existing user', async () => {
    jest.spyOn(repo, 'findByUsername').mockResolvedValue({
      id: 1,
      username: 'test',
      password: 'hashedpw',
      nickname: 'nick',
    });

    const result = await service.createUser('test', '1234', 'nick');
    expect(result).toEqual({
      error: {
        code: 'USER_ALREADY_EXISTS',
        message: '이미 가입된 사용자입니다.',
      },
    });
  });

  it('should login with valid credentials', async () => {
    const hashed = await bcrypt.hash('1234', 10);
    jest.spyOn(repo, 'findByUsername').mockResolvedValue({
      id: 1,
      username: 'test',
      password: hashed,
      nickname: 'nick',
    });
    jest.spyOn(jwt, 'sign').mockReturnValue('mocked-token');

    const result = await service.validateLogin('test', '1234');
    expect(result).toEqual({ token: 'mocked-token' });
  });

  it('should return error for invalid user login', async () => {
    jest.spyOn(repo, 'findByUsername').mockResolvedValue(null);

    const result = await service.validateLogin('wrong', '1234');
    expect(result).toEqual({
      error: {
        code: 'INVALID_CREDENTIALS',
        message: '아이디 또는 비밀번호가 올바르지 않습니다.',
      },
    });
  });

  it('should return error for invalid password login', async () => {
    const hashed = await bcrypt.hash('correct', 10);
    jest.spyOn(repo, 'findByUsername').mockResolvedValue({
      id: 1,
      username: 'test',
      password: hashed,
      nickname: 'nick',
    });

    const result = await service.validateLogin('test', 'wrong');
    expect(result).toEqual({
      error: {
        code: 'INVALID_CREDENTIALS',
        message: '아이디 또는 비밀번호가 올바르지 않습니다.',
      },
    });
  });
});
