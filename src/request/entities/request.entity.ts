import { ApiProperty } from '@nestjs/swagger';
import { Mentee } from 'mentee/entities/mentee.entity';
import { Mentor } from 'mentor/entities/mentor.entity';

export class Request {
  @ApiProperty()
  id: number;

  @ApiProperty()
  mentor: Mentor;

  @ApiProperty()
  mentee: Mentee;

  @ApiProperty()
  approved: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
