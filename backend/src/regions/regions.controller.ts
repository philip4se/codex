import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RegionsService } from './regions.service';

@ApiTags('regions')
@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  @ApiOperation({ summary: '지역 목록 조회' })
  @ApiQuery({ name: 'level', required: false, description: '1: 국가, 2: 광역, 3: 시군구, 4: 읍면동' })
  @ApiQuery({ name: 'parentId', required: false, description: '상위 지역 ID' })
  async findAll(
    @Query('level') level?: number,
    @Query('parentId') parentId?: string,
  ) {
    if (level) {
      return this.regionsService.findByLevel(+level);
    }
    if (parentId) {
      return this.regionsService.findByParentId(parentId);
    }
    return this.regionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '지역 상세 조회' })
  async findOne(@Param('id') id: string) {
    return this.regionsService.findById(id);
  }
}
