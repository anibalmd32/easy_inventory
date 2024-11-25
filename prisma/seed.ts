import { PrismaClient, Prisma } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

const saltRounds = 10;
const hashPassword = async (password: string) => hash(password, saltRounds);

async function main() {
  const categories: Prisma.CategoryCreateInput[] = [
    {
      name: 'autopartes',
      color: '#ca0c47',
    },
    {
      name: 'electrodomésticos',
      color: '#0c92ae',
    },
    {
      name: 'electrónicos',
      color: '#db651b',
    },
  ];

  const users: Prisma.UserCreateInput[] = [
    {
      name: 'Administrator',
      email: 'admin@example.com',
      password: await hashPassword('admin'),
      isAdmin: true,
      isEmployee: false,
    },
    {
      name: 'Empleado',
      email: 'empleado@example.com',
      password: await hashPassword('empleado'),
      isAdmin: false,
      isEmployee: true,
    },
  ];

  const seedCategories = async () => {
    const existingCategories = await prisma.category.findMany();

    if (existingCategories.length === 0) {
      await prisma.category.createMany({ data: categories });
      console.log('Las categorías fueron creadas');
    }
  };

  const seedUsers = async () => {
    const existingUsers = await prisma.user.findMany();
    if (existingUsers.length === 0) {
      await prisma.user.createMany({ data: users });
      console.log('Los usuarios fueron creados');
    }
  };

  try {
    await seedCategories();
    await seedUsers();
    process.exit(0);
  } catch (error: any) {
    throw new Error(error.message);
  }
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
