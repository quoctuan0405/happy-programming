import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Skill } from '../../skills/entities/skill.entity';

export class Mentor {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phoneNumber?: string;

  @ApiPropertyOptional()
  resumeSummary?: string;

  @ApiPropertyOptional()
  workExperience?: string;

  @ApiPropertyOptional()
  education?: string;

  @ApiPropertyOptional()
  certificate?: string;

  @ApiPropertyOptional({ type: [Skill] })
  skills?: Skill[];

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  updatedAt?: Date;
}
