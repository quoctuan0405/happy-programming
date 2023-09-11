import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric } from 'class-validator';

export class UpdateMentorDto {
  @ApiProperty()
  @IsAlphanumeric()
  phoneNumber: string;

  @ApiProperty()
  resumeSummary: string;

  @ApiProperty()
  workExperience: string;

  @ApiProperty()
  education: string;

  @ApiProperty()
  certificate: string;

  @ApiProperty()
  skillIds: number[];
}
