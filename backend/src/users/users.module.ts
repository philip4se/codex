import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Member } from './entities/member.entity';
import { Consent } from './entities/consent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Consent])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
