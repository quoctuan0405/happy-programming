import { Pagination } from 'common/pagination.entity';
import { Request } from './request.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RequestList {
  @ApiProperty({ type: [Request] })
  requests: Request[];

  @ApiProperty()
  pagination: Pagination;
}
