import { BadRequestException, Injectable } from '@nestjs/common';
import { MentorSignupDto } from './dto/mentor-signup.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { Mentor, Prisma } from '@prisma/client';
import { Role } from 'common/role.enum';

@Injectable()
export class MentorService {
  constructor(
    private prisma: PrismaService,
    private userService: UsersService,
  ) {}

  async create(mentorSignupDto: MentorSignupDto) {
    try {
      const user = await this.userService.create({
        email: mentorSignupDto.email,
        username: mentorSignupDto.username,
        password: mentorSignupDto.password,
        role: Role.MENTOR,
      });

      const mentor = await this.prisma.mentor.create({
        data: {
          user_id: user.id,
          phone_number: '',
          resume_summary: '',
          work_experience: '',
          education: '',
          certificate: '',
        },
      });

      return { ...mentor, user } as const;
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

  async findAll(
    keyword: string = '',
    skillIds: number[] = [],
    page: number = 1,
    size: number = 10,
  ) {
    // Skill query
    let skillsQuery = {};

    if (skillIds.length !== 0) {
      skillsQuery = {
        skills: {
          some: {
            skills_id: {
              in: skillIds,
            },
          },
        },
      };
    }

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
          {
            phone_number: { contains: keyword },
          },
          {
            resume_summary: { contains: keyword },
          },
          {
            work_experience: { contains: keyword },
          },
          {
            education: { contains: keyword },
          },
          {
            certificate: { contains: keyword },
          },
        ],
        is_deleted: false,
        ...skillsQuery,
      },
    };

    // Find mentors
    const mentors = await this.prisma.mentor.findMany({
      ...whereQuery,
      include: { user: true, skills: { include: { skills: true } } },
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
    const count = await this.prisma.mentor.count({ ...whereQuery });

    return { mentors, count } as const;
  }

  async findOne(id: number) {
    return this.prisma.mentor.findUnique({
      where: { id, is_deleted: false },
      include: { user: true, skills: { include: { skills: true } } },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.mentor.findUnique({
      where: { user_id: userId, is_deleted: false },
    });
  }

  async update(mentorId: number, updateMentorDto: UpdateMentorDto) {
    await this.prisma.mentorSkills.deleteMany({
      where: { mentor_id: mentorId },
    });

    return this.prisma.mentor.update({
      where: { id: mentorId, is_deleted: false },
      data: {
        phone_number: updateMentorDto.phoneNumber,
        resume_summary: updateMentorDto.resumeSummary,
        work_experience: updateMentorDto.workExperience,
        education: updateMentorDto.education,
        certificate: updateMentorDto.certificate,
        skills: {
          create: updateMentorDto.skillIds.map((skillId) => ({
            skills: {
              connect: {
                id: skillId,
              },
            },
          })),
        },
      },
    });
  }

  async remove(mentorId: number) {
    const mentor = await this.prisma.mentor.update({
      where: { id: mentorId, is_deleted: false },
      data: { is_deleted: true },
      include: {
        user: true,
      },
    });

    await this.userService.remove(mentor.user.id);

    return mentor;
  }
}
