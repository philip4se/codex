import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: '회원 가입' })
  async register(@Body() createMemberDto: CreateMemberDto) {
    const member = await this.usersService.create(createMemberDto);
    // 비밀번호 해시는 반환하지 않음
    const { passwordHash, ...result } = member;
    return result;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 정보 조회' })
  async getProfile(@CurrentUser() user: any) {
    const member = await this.usersService.findById(user.userId);
    const { passwordHash, ...result } = member;
    return result;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '회원 정보 조회' })
  async findOne(@Param('id') id: string) {
    const member = await this.usersService.findById(id);
    const { passwordHash, ...result } = member;
    return result;
  }
}
