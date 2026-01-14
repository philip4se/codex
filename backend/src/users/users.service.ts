import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    // 이메일 중복 확인
    const existingEmail = await this.membersRepository.findOne({
      where: { email: createMemberDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }

    // 전화번호 중복 확인
    const existingPhone = await this.membersRepository.findOne({
      where: { phone: createMemberDto.phone },
    });
    if (existingPhone) {
      throw new ConflictException('이미 등록된 전화번호입니다.');
    }

    // 비밀번호 해싱
    const passwordHash = await bcrypt.hash(createMemberDto.password, 10);

    // 회원 생성
    const member = this.membersRepository.create({
      email: createMemberDto.email,
      passwordHash,
      name: createMemberDto.name,
      phone: createMemberDto.phone,
      birthDate: new Date(createMemberDto.birthDate),
    });

    return this.membersRepository.save(member);
  }

  async findByEmail(email: string): Promise<Member | null> {
    return this.membersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<Member> {
    const member = await this.membersRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!member) {
      throw new NotFoundException('회원을 찾을 수 없습니다.');
    }
    return member;
  }

  async validatePassword(member: Member, password: string): Promise<boolean> {
    return bcrypt.compare(password, member.passwordHash);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.membersRepository.update(id, {
      lastLoginAt: new Date(),
    });
  }
}
