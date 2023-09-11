import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import * as bcrypt from 'bcryptjs';
import { ApiTags } from '@nestjs/swagger';
import { JWTRequest } from 'auth/jwt.strategy';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/password/change')
  async changePassword(
    @Request() req: JWTRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.usersService.findOne(req.user.id);

    if (
      !user ||
      !(await bcrypt.compare(changePasswordDto.oldPassword, user.password))
    ) {
      throw new UnauthorizedException();
    }

    await this.usersService.updatePassword(
      user.id,
      changePasswordDto.newPassword,
    );
  }
}
