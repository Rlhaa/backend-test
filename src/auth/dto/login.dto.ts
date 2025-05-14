import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: '아이디', maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  username: string;

  @ApiProperty({ description: '비밀번호', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  password: string;
}
