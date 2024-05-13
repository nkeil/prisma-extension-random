import { prisma } from './db.js';

const main = async () => {
  const user = await prisma.user.findRandom({
    where: { id: { gt: 2 } },
    select: { id: true, firstName: true },
  });

  const posts = await prisma.post.findManyRandom(10, {
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

  const posts2 = await prisma.post.findManyRandom(10);

  console.log({ user, posts, posts2 });

  try {
    const strange = await prisma.strange.findManyRandom(5);
    console.log(strange);
  } catch (e) {
    console.log('there was an error');
  }
};

main();
