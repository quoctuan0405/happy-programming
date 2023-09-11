import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, isNotEmpty } from 'class-validator';

export class UpdateSkillDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
