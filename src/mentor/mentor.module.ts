import { Module } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { MentorController } from './mentor.controller';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RequestService } from 'request/request.service';

@Module({
  controllers: [MentorController],

  providers: [MentorService, PrismaService, UsersService, RequestService],
})
export class MentorModule {}
