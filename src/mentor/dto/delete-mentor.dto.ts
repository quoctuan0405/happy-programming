import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteMentorDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;
}
