import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SkillsModule } from './skills/skills.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MentorModule } from './mentor/mentor.module';
import { ConfigModule } from '@nestjs/config';
import { MenteeModule } from './mentee/mentee.module';
import { RequestModule } from './request/request.module';

@Module({
  imports: [
    SkillsModule,
    UsersModule,
    AuthModule,
    MentorModule,
    ConfigModule.forRoot(),
    MenteeModule,
    RequestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_PIPE,
    //   useValue: new ValidationPipe({
    //     whitelist: true,
    //     forbidNonWhitelisted: true,
    //     transform: true,
    //   }),
    // },
  ],
})
export class AppModule {}
