import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { MenteeService } from './mentee.service';
import { MenteeSignupDto } from './dto/mentee-signup.dto';
import { MenteeList } from './entities/mentee-list.entity';
import { Mentee } from './entities/mentee.entity';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { DeleteMenteeDto } from './dto/delete-mentee.dto';
import { RequestService } from 'request/request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JWTRequest } from 'auth/jwt.strategy';
import { Roles } from 'auth/roles.decorator';
import { Role } from 'common/role.enum';
import { RolesGuard } from 'auth/roles.guard';
import { MentorList } from 'mentor/entities/mentor-list.entity';

@ApiTags('mentee')
@Controller('mentee')
export class MenteeController {
  constructor(
    private readonly menteeService: MenteeService,
    private readonly requestService: RequestService,
  ) {}

  @Post('/signup')
  async signup(@Body() createMenteeDto: MenteeSignupDto) {
    await this.menteeService.create(createMenteeDto);
  }

  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ type: MenteeList })
  @Get()
  async findAll(
    @Query('keyword') keyword: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<MenteeList> {
    const { mentees, count } = await this.menteeService.findAll(
      keyword,
      +page,
      +size,
    );

    return {
      mentees: mentees.map((mentee) => ({
        id: mentee.user.id,
        username: mentee.user.username,
        email: mentee.user.email,
        createdAt: mentee.created_at,
        updatedAt: mentee.updated_at,
      })),
      pagination: {
        count,
        displayRecord: mentees.length,
        numPages: Math.ceil(count / size),
        page,
      },
    };
  }

  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ type: Mentee })
  @Get('/detail')
  async findOne(@Query('id') id: string): Promise<Mentee> {
    if (!+id) {
      throw new BadRequestException('Invalid id');
    }

    const mentee = await this.menteeService.findOne(+id);

    return {
      id: mentee.user.id,
      username: mentee.user.username,
      email: mentee.user.email,
      createdAt: mentee.created_at,
      updatedAt: mentee.updated_at,
    };
  }

  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ type: Mentee })
  @Delete()
  async remove(@Body() deleteMenteeDto: DeleteMenteeDto): Promise<Mentee> {
    const mentee = await this.menteeService.remove(deleteMenteeDto.id);

    return {
      id: mentee.user.id,
      username: mentee.user.username,
      email: mentee.user.email,
      createdAt: mentee.created_at,
      updatedAt: mentee.updated_at,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('request')
  async createRequest(
    @Request() req: JWTRequest,
    @Body() createRequestDto: CreateRequestDto,
  ) {
    const mentee = await this.menteeService.findByUserId(req.user.id);

    if (!mentee) {
      throw new UnauthorizedException();
    }

    await this.requestService.create({
      mentorId: createRequestDto.mentorId,
      menteeId: mentee.id,
    });
  }
}
