import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Put,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { DeleteSkillDto } from './dto/delete-skill.dto';
import { Skill } from './entities/skill.entity';
import { SkillList } from './entities/skillList.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'auth/roles.decorator';
import { Role } from 'common/role.enum';
import { RolesGuard } from 'auth/roles.guard';

@ApiTags('skill')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createSkillDto: CreateSkillDto): Promise<Skill> {
    const skill = await this.skillsService.create(createSkillDto);

    if (!skill) {
      throw new NotFoundException();
    } else {
      return {
        id: skill.id,
        name: skill.name,
        createdAt: skill.created_at,
        updatedAt: skill.updated_at,
      };
    }
  }

  @Get()
  async find(
    @Query('keyword') keyword: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<SkillList> {
    const skills = await this.skillsService.find(keyword, page, size);
    const count = await this.skillsService.count();

    return {
      skills: skills.map(({ id, name, created_at, updated_at }) => ({
        id,
        name,
        createdAt: created_at,
        updatedAt: updated_at,
      })),
      pagination: {
        count,
        displayRecord: skills.length,
        numPages: Math.ceil(count / size),
        page,
      },
    };
  }

  @Get('/detail')
  async findOne(@Query('id') id: string): Promise<Skill> {
    const skill = await this.skillsService.findOne(+id);

    if (!skill) {
      throw new NotFoundException();
    } else {
      return {
        id: skill.id,
        name: skill.name,
        createdAt: skill.created_at,
        updatedAt: skill.updated_at,
      };
    }
  }

  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put()
  @Patch()
  async update(@Body() updateSkillDto: UpdateSkillDto): Promise<Skill> {
    const skill = await this.skillsService.update(updateSkillDto);

    if (!skill) {
      throw new NotFoundException();
    } else {
      return {
        id: skill.id,
        name: skill.name,
        createdAt: skill.created_at,
        updatedAt: skill.updated_at,
      };
    }
  }

  @Roles([Role.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete()
  async remove(@Body() deleteSkillDto: DeleteSkillDto): Promise<Skill> {
    const skill = await this.skillsService.remove(deleteSkillDto);

    if (!skill) {
      throw new NotFoundException();
    } else {
      return {
        id: skill.id,
        name: skill.name,
        createdAt: skill.created_at,
        updatedAt: skill.updated_at,
      };
    }
  }
}
