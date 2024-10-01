import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

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

  const seedCategories = async () => {
    await prisma.category.createMany({ data: categories });
    console.log('Las categorías fueron creadas');
  };

  try {
    await seedCategories();
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
