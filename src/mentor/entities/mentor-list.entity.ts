import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from '../../common/pagination.entity';
import { Mentor } from './mentor.entity';

export class MentorList {
  @ApiProperty({ type: [Mentor] })
  mentors: Mentor[];

  @ApiProperty()
  pagination: Pagination;
}
