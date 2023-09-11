import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { PrismaService } from '../prisma.service';
import { DeleteSkillDto } from './dto/delete-skill.dto';
import { Skills } from '@prisma/client';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  create(createSkillDto: CreateSkillDto): Promise<Skills> {
    return this.prisma.skills.create({ data: { name: createSkillDto.name } });
  }

  find(
    keyword: string = '',
    page: number = 1,
    size: number = 10,
  ): Promise<Skills[]> {
    return this.prisma.skills.findMany({
      skip: (page - 1) * size,
      take: size,
      where: {
        name: {
          contains: keyword,
        },
        is_deleted: false,
      },
      orderBy: [
        {
          name: 'asc',
        },
        {
          id: 'asc',
        },
      ],
    });
  }

  count(keyword: string = ''): Promise<number> {
    return this.prisma.skills.count({
      where: { name: { contains: keyword }, is_deleted: false },
    });
  }

  findOne(id: number): Promise<Skills> {
    return this.prisma.skills.findUnique({
      where: { id, is_deleted: false },
    });
  }

  update(updateSkillDto: UpdateSkillDto): Promise<Skills> {
    return this.prisma.skills.update({
      where: { id: updateSkillDto.id, is_deleted: false },
      data: { name: updateSkillDto.name },
    });
  }

  remove(deleteSkillDto: DeleteSkillDto): Promise<Skills> {
    return this.prisma.skills.update({
      where: { id: deleteSkillDto.id },
      data: {
        is_deleted: true,
      },
    });
  }
}
