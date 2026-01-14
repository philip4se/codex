import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Occupation } from './entities/occupation.entity';

@Injectable()
export class OccupationsService {
  constructor(
    @InjectRepository(Occupation)
    private occupationsRepository: Repository<Occupation>,
  ) {}

  async findAll(): Promise<Occupation[]> {
    return this.occupationsRepository.find({
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async findByCategory(category: string): Promise<Occupation[]> {
    return this.occupationsRepository.find({
      where: { category },
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Occupation> {
    return this.occupationsRepository.findOne({ where: { id } });
  }

  async seed() {
    // 초기 직업 데이터 생성
    const existingOccupations = await this.occupationsRepository.count();
    if (existingOccupations > 0) {
      return;
    }

    const occupations = [
      { code: 'OCC-001', name: '관리자', category: '관리직' },
      { code: 'OCC-002', name: '경영진', category: '관리직' },
      { code: 'OCC-101', name: '과학 전문가', category: '전문직' },
      { code: 'OCC-102', name: '정보통신 전문가', category: '전문직' },
      { code: 'OCC-103', name: '소프트웨어 개발자', category: '전문직' },
      { code: 'OCC-104', name: '데이터 분석가', category: '전문직' },
      { code: 'OCC-105', name: '의료인', category: '전문직' },
      { code: 'OCC-106', name: '교육 전문가', category: '전문직' },
      { code: 'OCC-201', name: '사무 종사자', category: '사무직' },
      { code: 'OCC-202', name: '회계·경리', category: '사무직' },
      { code: 'OCC-301', name: '서비스 종사자', category: '서비스직' },
      { code: 'OCC-302', name: '판매 종사자', category: '판매직' },
      { code: 'OCC-401', name: '농림어업 종사자', category: '농림어업' },
      { code: 'OCC-501', name: '기능원 및 관련 기능 종사자', category: '기능직' },
      { code: 'OCC-601', name: '장치·기계 조작 및 조립 종사자', category: '기능직' },
      { code: 'OCC-701', name: '단순노무 종사자', category: '단순노무직' },
      { code: 'OCC-801', name: '학생', category: '기타' },
      { code: 'OCC-802', name: '주부', category: '기타' },
      { code: 'OCC-803', name: '무직', category: '기타' },
      { code: 'OCC-804', name: '은퇴', category: '기타' },
    ];

    await this.occupationsRepository.save(occupations);
  }
}
