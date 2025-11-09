import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('surveys')
@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '설문 생성' })
  async create(@CurrentUser() user: any, @Body() createSurveyDto: CreateSurveyDto) {
    return this.surveysService.create(user.userId, createSurveyDto);
  }

  @Get()
  @ApiOperation({ summary: '설문 목록 조회' })
  @ApiQuery({ name: 'userId', required: false, description: '특정 사용자의 설문만 조회' })
  async findAll(@Query('userId') userId?: string) {
    return this.surveysService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '설문 상세 조회' })
  async findOne(@Param('id') id: string) {
    return this.surveysService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '설문 수정' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateSurveyDto: UpdateSurveyDto,
  ) {
    return this.surveysService.update(id, user.userId, updateSurveyDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '설문 상태 변경' })
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('status') status: string,
  ) {
    return this.surveysService.updateStatus(id, user.userId, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '설문 삭제' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    await this.surveysService.delete(id, user.userId);
    return { message: '설문이 삭제되었습니다.' };
  }
}
