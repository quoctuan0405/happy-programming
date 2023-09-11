import { ApiProperty } from '@nestjs/swagger';

export class Pagination {
  @ApiProperty()
  page: number;

  @ApiProperty()
  count: number;

  @ApiProperty()
  displayRecord: number;

  @ApiProperty()
  numPages: number;
}
