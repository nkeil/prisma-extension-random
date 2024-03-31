import { prisma } from './db.js';

const main = async () => {
  const user = await prisma.user.findRandom({
    where: { id: { gt: 2 } },
    select: { id: true, firstName: true },
  });

  const post = await prisma.post.findManyRandom(10, {
    select: { title: true },
    where: {
      OR: [
        { title: { contains: 'prisma' } },
        { content: { contains: 'prisma' } },
      ],
      published: true,
    },
    custom_uniqueKey: 'id',
  });

  console.log({ user, post });
};

main();
