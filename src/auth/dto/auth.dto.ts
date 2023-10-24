import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
