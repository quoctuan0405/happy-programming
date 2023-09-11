import { BadRequestException, Injectable } from '@nestjs/common';
import { MenteeSignupDto } from './dto/mentee-signup.dto';
import { UsersService } from 'users/users.service';
import { PrismaService } from 'prisma.service';
import { Prisma } from '@prisma/client';
import { Role } from 'common/role.enum';

@Injectable()
export class MenteeService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
  ) {}
  async create(menteeSignupDto: MenteeSignupDto) {
    try {
      const user = await this.userService.create({
        email: menteeSignupDto.email,
        username: menteeSignupDto.username,
        password: menteeSignupDto.password,
        role: Role.MENTEE,
      });

      const mentee = await this.prisma.mentee.create({
        data: {
          user_id: user.id,
        },
      });

      return { ...mentee, user } as const;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          throw new BadRequestException(
            'There is a unique constraint violation, a new user cannot be created with this email',
          );
        }
      }
    }
  }

  async findAll(keyword: string = '', page: number = 1, size: number = 10) {
    // Where query
    let whereQuery = {
      where: {
        OR: [
          {
            user: { email: { contains: keyword } },
          },
          {
            user: { username: { contains: keyword } },
          },
        ],
      },
    };

    // Find mentees
    const mentees = await this.prisma.mentee.findMany({
      ...whereQuery,
      include: { user: true },
      skip: (page - 1) * size,
      take: size,
      orderBy: [
        {
          user: {
            username: 'asc',
          },
        },
        {
          id: 'asc',
        },
      ],
    });

    // Count mentors
    const count = await this.prisma.mentee.count({ ...whereQuery });

    return { mentees, count } as const;
  }

  async findByUserId(userId: number) {
    return this.prisma.mentee.findUnique({
      where: { user_id: userId, is_deleted: false },
    });
  }

  findOne(menteeId: number) {
    return this.prisma.mentee.findUnique({
      where: { id: menteeId, is_deleted: false },
      include: { user: true },
    });
  }

  async remove(menteeId: number) {
    const mentee = await this.prisma.mentor.update({
      where: { id: menteeId, is_deleted: false },
      data: { is_deleted: true },
      include: { user: true },
    });

    await this.userService.remove(mentee.user.id);

    return mentee;
  }
}
