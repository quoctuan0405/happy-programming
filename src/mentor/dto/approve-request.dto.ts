import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ApproveRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;
}
