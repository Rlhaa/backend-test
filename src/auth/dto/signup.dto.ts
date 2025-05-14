import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ description: '아이디', maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @ApiProperty({ description: '비밀번호', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @Length(8, 100) // 보안상 최소 8자 이상 추천
  password: string;

  @ApiProperty({ description: '닉네임', maxLength: 10 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  nickname: string;
}
