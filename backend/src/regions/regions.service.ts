import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private regionsRepository: Repository<Region>,
  ) {}

  async findAll(): Promise<Region[]> {
    return this.regionsRepository.find({
      order: { level: 'ASC', name: 'ASC' },
    });
  }

  async findByLevel(level: number): Promise<Region[]> {
    return this.regionsRepository.find({
      where: { level },
      order: { name: 'ASC' },
    });
  }

  async findByParentId(parentId: string): Promise<Region[]> {
    return this.regionsRepository.find({
      where: { parentId },
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Region> {
    return this.regionsRepository.findOne({ where: { id } });
  }

  async seed() {
    // 초기 지역 데이터 생성
    const existingRegions = await this.regionsRepository.count();
    if (existingRegions > 0) {
      return;
    }

    // 국가
    const korea = await this.regionsRepository.save({
      code: 'KR',
      name: '대한민국',
      level: 1,
    });

    // 광역시도
    const seoul = await this.regionsRepository.save({
      code: 'KR-11',
      name: '서울특별시',
      level: 2,
      parentId: korea.id,
    });

    const gyeonggi = await this.regionsRepository.save({
      code: 'KR-41',
      name: '경기도',
      level: 2,
      parentId: korea.id,
    });

    // 시군구
    const gangnam = await this.regionsRepository.save({
      code: 'KR-11-680',
      name: '강남구',
      level: 3,
      parentId: seoul.id,
    });

    const seocho = await this.regionsRepository.save({
      code: 'KR-11-650',
      name: '서초구',
      level: 3,
      parentId: seoul.id,
    });

    const seongnam = await this.regionsRepository.save({
      code: 'KR-41-210',
      name: '성남시',
      level: 3,
      parentId: gyeonggi.id,
    });

    // 읍면동
    await this.regionsRepository.save([
      {
        code: 'KR-11-680-101',
        name: '역삼동',
        level: 4,
        parentId: gangnam.id,
      },
      {
        code: 'KR-11-680-102',
        name: '삼성동',
        level: 4,
        parentId: gangnam.id,
      },
    ]);
  }
}
