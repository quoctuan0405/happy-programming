import { Module } from '@nestjs/common';
import { MenteeService } from './mentee.service';
import { MenteeController } from './mentee.controller';
import { UsersService } from 'users/users.service';
import { PrismaService } from 'prisma.service';
import { RequestService } from 'request/request.service';

@Module({
  controllers: [MenteeController],
  providers: [MenteeService, UsersService, PrismaService, RequestService],
})
export class MenteeModule {}
