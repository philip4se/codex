import { Controller, Get, Post, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('profiles')
@Controller('profiles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @ApiOperation({ summary: '프로필 생성' })
  async create(
    @CurrentUser() user: any,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.profilesService.create(user.userId, createProfileDto);
  }

  @Get('me')
  @ApiOperation({ summary: '내 프로필 조회' })
  async getMyProfile(@CurrentUser() user: any) {
    return this.profilesService.findByMemberId(user.userId);
  }

  @Put('me')
  @ApiOperation({ summary: '프로필 수정' })
  async update(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.update(user.userId, updateProfileDto);
  }
}
