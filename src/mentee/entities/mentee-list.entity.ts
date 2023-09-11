import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from '../../common/pagination.entity';
import { Mentee } from './mentee.entity';

export class MenteeList {
  @ApiProperty({ type: [Mentee] })
  mentees: Mentee[];

  @ApiProperty()
  pagination: Pagination;
}
