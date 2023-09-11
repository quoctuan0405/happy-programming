import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  Request,
  Put,
  UseGuards,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MentorService } from './mentor.service';
import { MentorSignupDto } from './dto/mentor-signup.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { Mentor } from './entities/mentor.entity';
import { MentorList } from './entities/mentor-list.entity';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { DeleteMentorDto } from './dto/delete-mentor.dto';
import { RequestService } from 'request/request.service';
import { RequestList } from 'request/entities/requestList.entity';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JWTRequest } from 'auth/jwt.strategy';
import { Roles } from 'auth/roles.decorator';
import { Role } from 'common/role.enum';
import { RolesGuard } from 'auth/roles.guard';

@ApiTags('mentor')
@Controller('mentor')
export class MentorController {
  constructor(
    private readonly mentorService: MentorService,
    private readonly requestService: RequestService,
  ) {}

  @Post('/signup')
  async signup(@Body() mentorSignupDto: MentorSignupDto) {
    await this.mentorService.create(mentorSignupDto);
  }

  @ApiOkResponse({ type: MentorList })
  @Get()
  async findAll(
    @Query('keyword') keyword: string = '',
    @Query('skillIds') skillIds: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<MentorList> {
    const { mentors, count } = await this.mentorService.findAll(
      keyword,
      skillIds
        .split(',')
        .map((skillId) => +skillId)
        .filter(
          (skillId) =>
            skillId !== 0 && skillId !== undefined && skillId !== null,
        ),
      +page,
      +size,
    );

    return {
      mentors: mentors.map((mentor) => ({
        id: mentor.user.id,
        username: mentor.user.username,
        email: mentor.user.email,
        phoneNumber: mentor.phone_number,
        resumeSummary: mentor.resume_summary,
        workExperience: mentor.work_experience,
        education: mentor.education,
        certificate: mentor.certificate,
        skills: mentor.skills.map((skill) => ({
          id: skill.skills.id,
          name: skill.skills.name,
          createdAt: skill.skills.created_at,
          updatedAt: skill.skills.updated_at,
        })),
        createdAt: mentor.created_at,
        updatedAt: mentor.updated_at,
      })),
      pagination: {
        count,
        displayRecord: mentors.length,
        numPages: Math.ceil(count / size),
        page,
      },
    };
  }

  @ApiOkResponse({ type: Mentor })
  @Get('/detail')
  async findOne(@Query('id') id: string): Promise<Mentor> {
    if (!+id) {
      throw new BadRequestException('Invalid id');
    }

    const mentor = await this.mentorService.findOne(+id);

    return {
      id: mentor.user.id,
      username: mentor.user.username,
      email: mentor.user.email,
      phoneNumber: mentor.phone_number,
      resumeSummary: mentor.resume_summary,
      workExperience: mentor.work_experience,
      education: mentor.education,
      certificate: mentor.certificate,
      skills: mentor.skills.map((skill) => ({
        id: skill.skills.id,
        name: skill.skills.name,
        createdAt: skill.skills.created_at,
        updatedAt: skill.skills.updated_at,
      })),
      createdAt: mentor.created_at,
      updatedAt: mentor.updated_at,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @Patch()
  async update(
    @Request() req: JWTRequest,
    @Body() updateMentorDto: UpdateMentorDto,
  ) {
    const mentor = await this.mentorService.findByUserId(req.user.id);

    await this.mentorService.update(mentor.id, updateMentorDto);
  }

  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete()
  async delete(@Body() deleteMentorDto: DeleteMentorDto): Promise<Mentor> {
    const mentor = await this.mentorService.remove(deleteMentorDto.id);

    if (!mentor) {
      throw new NotFoundException();
    } else {
      return {
        id: mentor.user.id,
        username: mentor.user.username,
        email: mentor.user.email,
        createdAt: mentor.created_at,
        updatedAt: mentor.updated_at,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: RequestList })
  @Get('request')
  async getMyRequest(
    @Request() req: JWTRequest,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<RequestList> {
    const mentor = await this.mentorService.findByUserId(req.user.id);

    const { requests, count } = await this.requestService.findAll(
      [mentor.id],
      [],
      page,
      size,
    );

    return {
      requests: requests.map((request) => ({
        id: request.id,
        mentor: {
          id: request.mentor.id,
          username: request.mentor.user.username,
          email: request.mentor.user.email,
        },
        mentee: {
          id: request.mentee.id,
          username: request.mentee.user.username,
          email: request.mentee.user.email,
        },
        approved: request.approved,
        createdAt: request.created_at,
        updatedAt: request.updated_at,
      })),
      pagination: {
        count,
        displayRecord: requests.length,
        numPages: Math.ceil(count / size),
        page,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('request/approve')
  async approveRequest(
    @Request() req: JWTRequest,
    @Body() approveRequestDto: ApproveRequestDto,
  ) {
    // Find request
    const request = await this.requestService.findOne(approveRequestDto.id);

    if (!request) {
      throw new NotFoundException();
    }

    // Validate if this user have the right to approve this request or not
    const mentor = await this.mentorService.findByUserId(req.user.id);

    if (!mentor || request.mentor_id !== mentor.id) {
      throw new UnauthorizedException();
    }

    await this.requestService.approve(request.id);
  }
}
