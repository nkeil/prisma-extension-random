import { Prisma, User } from '@prisma/client';

// "User" types are used to simplify type inference

export const findRandomSingle = async (
  context: Prisma.UserDelegate,
  args?: Prisma.UserFindFirstArgs,
): Promise<any> => {
  const numRows = await context.count({
    where: args?.where,
  });
  return await context.findFirst({
    ...args,
    skip: Math.max(0, Math.floor(Math.random() * numRows)),
  });
};

export const findRandomMany = async (
  context: Prisma.UserDelegate,
  num: number,
  args?: {
    select?: Prisma.UserFindFirstArgs['select'];
    where?: Prisma.UserFindFirstArgs['where'];
  },
): Promise<any> => {
  const select = args?.select ?? { id: true as const };
  let where = args?.where ?? {};

  let numRows = await context.count({ where });

  const rows = [];
  const rowIds: User['id'][] = [];

  where = {
    ...where,
    id: { notIn: rowIds },
  };

  for (let i = 0; i < num && numRows > 0; ++i) {
    const row = await context.findFirst({
      select,
      where,
      skip: Math.max(0, Math.floor(Math.random() * numRows)),
    });

    if (!row) {
      console.error(
        `get random row failed. Where clause: ${JSON.stringify(where)}`,
      );
      break;
    }
    rows.push(row);
    rowIds.push(row.id);
    numRows--;
  }

  return rows;
};
