import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  async create(memberId: string, createProfileDto: CreateProfileDto): Promise<Profile> {
    const profile = this.profilesRepository.create({
      memberId,
      ...createProfileDto,
    });
    return this.profilesRepository.save(profile);
  }

  async findByMemberId(memberId: string): Promise<Profile> {
    return this.profilesRepository.findOne({
      where: { memberId },
      relations: ['country', 'province', 'city', 'district', 'occupation'],
    });
  }

  async update(memberId: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findByMemberId(memberId);
    if (!profile) {
      throw new NotFoundException('프로필을 찾을 수 없습니다.');
    }

    Object.assign(profile, updateProfileDto);
    return this.profilesRepository.save(profile);
  }

  async delete(memberId: string): Promise<void> {
    await this.profilesRepository.delete({ memberId });
  }
}
