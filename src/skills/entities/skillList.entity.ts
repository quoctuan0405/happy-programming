import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from '../../common/pagination.entity';
import { Skill } from './skill.entity';

export class SkillList {
  @ApiProperty({ type: [Skill] })
  skills: Skill[];

  @ApiProperty()
  pagination: Pagination;
}
