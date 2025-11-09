import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OccupationsService } from './occupations.service';

@ApiTags('occupations')
@Controller('occupations')
export class OccupationsController {
  constructor(private readonly occupationsService: OccupationsService) {}

  @Get()
  @ApiOperation({ summary: '직업 목록 조회' })
  @ApiQuery({ name: 'category', required: false, description: '직업 분류' })
  async findAll(@Query('category') category?: string) {
    if (category) {
      return this.occupationsService.findByCategory(category);
    }
    return this.occupationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '직업 상세 조회' })
  async findOne(@Param('id') id: string) {
    return this.occupationsService.findById(id);
  }
}
