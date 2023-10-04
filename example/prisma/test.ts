import { prisma } from "../";

const main = async () => {
  const user = await prisma.user.findRandom();

  const post = await prisma.post.findManyRandom(10, {
    select: { id: true, title: true },
    where: {
      OR: [
        { title: { contains: "prisma" } },
        { content: { contains: "prisma" } },
      ],
      published: true,
    },
  });

  console.log({ user, post });
};

main();
