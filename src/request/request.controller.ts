import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
  UseGuards,
  Body,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestList } from './entities/requestList.entity';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { DeleteRequestDto } from './dto/delete-request.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'auth/roles.guard';
import { Role } from 'common/role.enum';
import { Roles } from 'auth/roles.decorator';
import { Request } from './entities/request.entity';

@ApiTags('request')
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ type: RequestList })
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<RequestList> {
    const { requests, count } = await this.requestService.findAll(
      [],
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
  @ApiOkResponse({ type: Request })
  @Get('/detail')
  async findOne(@Query('id') id: string): Promise<Request> {
    const request = await this.requestService.findOne(+id);

    return {
      id: request.id,
      mentor: {
        id: request.mentor.user.id,
        username: request.mentor.user.username,
        email: request.mentor.user.email,
      },
      mentee: {
        id: request.mentee.user.id,
        username: request.mentee.user.username,
        email: request.mentee.user.email,
      },
      approved: request.approved,
      createdAt: request.created_at,
      updatedAt: request.updated_at,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@Body() deleteRequestDto: DeleteRequestDto) {
    await this.requestService.remove(deleteRequestDto.id);
  }
}
