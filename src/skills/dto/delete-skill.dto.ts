import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteSkillDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
