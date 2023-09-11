import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;
}
