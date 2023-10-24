import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guards/local.guard';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { Request } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signup(createUserDto);
  }

  @Post('/signin')
  @UseGuards(LocalAuthGuard)
  async signin(
    @Req() request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signin(request.user);
  }

  @Get('/logout')
  @UseGuards(AccessTokenGuard)
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  @Get('/refresh')
  @UseGuards(RefreshTokenGuard)
  refreshToken(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    console.log(refreshToken);
    return this.authService.refreshToken(userId, refreshToken);
  }
}
