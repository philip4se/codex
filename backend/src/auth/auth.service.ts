import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const member = await this.usersService.findByEmail(loginDto.email);
    if (!member) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      member,
      loginDto.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 마지막 로그인 시간 업데이트
    await this.usersService.updateLastLogin(member.id);

    const payload = { email: member.email, sub: member.id, role: member.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: member.id,
        email: member.email,
        name: member.name,
        role: member.role,
      },
    };
  }

  async validateUser(email: string): Promise<any> {
    return this.usersService.findByEmail(email);
  }
}
