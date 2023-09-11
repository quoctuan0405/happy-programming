import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { PrismaService } from 'prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}

  create(createRequestDto: CreateRequestDto) {
    return this.prisma.request.create({
      data: {
        mentor_id: createRequestDto.mentorId,
        mentee_id: createRequestDto.menteeId,
      },
    });
  }

  async findAll(
    mentorIds: number[] = [],
    menteeIds: number[] = [],
    page: number = 1,
    size: number = 10,
  ) {
    // Mentor query
    let mentorQuery = {};

    if (mentorIds.length !== 0) {
      mentorQuery = {
        mentor_id: {
          in: mentorIds,
        },
      };
    }

    // Mentee query
    let menteeQuery = {};

    if (menteeIds.length !== 0) {
      menteeQuery = {
        mentee_id: {
          in: menteeIds,
        },
      };
    }

    // Where query
    let whereQuery = {
      where: {
        ...mentorQuery,
        ...menteeQuery,
      },
    };

    // Find request
    const requests = await this.prisma.request.findMany({
      ...whereQuery,
      include: {
        mentee: { include: { user: true } },
        mentor: { include: { user: true } },
      },
      skip: (page - 1) * size,
      take: size,
      orderBy: [
        {
          updated_at: 'desc',
        },
        {
          id: 'asc',
        },
      ],
    });

    // Count request
    const count = await this.prisma.request.count({ ...whereQuery });

    return { requests, count } as const;
  }

  findOne(id: number) {
    return this.prisma.request.findUnique({
      where: { id, is_deleted: false },
      include: {
        mentee: { include: { user: true } },
        mentor: { include: { user: true } },
      },
    });
  }

  approve(id: number) {
    return this.prisma.request.update({
      where: { id, is_deleted: false },
      data: { approved: true },
    });
  }

  async remove(id: number) {
    try {
      const request = await this.prisma.request.delete({ where: { id } });

      return request;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new BadRequestException('Request ID does not exists');
        }
      }
    }
  }
}
