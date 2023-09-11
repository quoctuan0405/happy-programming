import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteMenteeDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;
}
