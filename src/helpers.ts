import { Prisma, User } from '@prisma/client';

// "User" types are used to simplify type inference

export const $findRandom = async (
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

export const $findManyRandom = async (
  context: Prisma.UserDelegate,
  num: number,
  args?: {
    select?: Prisma.UserFindFirstArgs['select'];
    where?: Prisma.UserFindFirstArgs['where'];
    custom_uniqueKey?: 'id';
  },
): Promise<any> => {
  const uniqueKey = args?.custom_uniqueKey ?? 'id';

  const rows = [];
  const rowIds: User['id'][] = [];

  const select = args?.select ?? {};
  select[uniqueKey] = true;

  const where = args?.where ?? {};
  where[uniqueKey] = { notIn: rowIds };

  let numRows = await context.count({ where });
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
    rowIds.push(row[uniqueKey]);
    numRows--;
  }

  return rows;
};
