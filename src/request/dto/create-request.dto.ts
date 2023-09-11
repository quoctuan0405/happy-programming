import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  mentorId: number;

  @ApiProperty()
  @IsNotEmpty()
  menteeId: number;
}
