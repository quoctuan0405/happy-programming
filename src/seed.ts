import { PrismaClient } from '@prisma/client';
import { Role } from './common/role.enum';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password', salt);

  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@email.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
