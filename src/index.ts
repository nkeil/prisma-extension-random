import { Prisma } from '@prisma/client/extension';

type Args = {};

export default (_extensionArgs?: Args) =>
  Prisma.defineExtension((prisma) => {
    return prisma.$extends({
      name: 'prisma-extension-random',
      model: {
        $allModels: {
          async findRandom<T, A>(
            this: T,
            args?: Prisma.Exact<A, Prisma.Args<T, 'findFirst'>> & object,
          ) {
            const context = Prisma.getExtensionContext(this);

            const numRows = (await (context as any).count({
              where: (args as { where?: object } | undefined)?.where,
            })) as number;
            return (await (context as any).findFirst({
              ...args,
              skip: Math.max(0, Math.floor(Math.random() * numRows)),
            })) as Prisma.Result<T, A, 'findFirst'>;
          },

          async findManyRandom<T, TWhere, TSelect>(
            this: T,
            num: number,
            args?: {
              where?: Prisma.Exact<
                TWhere,
                Prisma.Args<T, 'findFirst'>['where']
              >;
              select?: Prisma.Exact<
                TSelect,
                Prisma.Args<T, 'findFirst'>['select'] & { id: true }
              >;
            },
          ) {
            const context = Prisma.getExtensionContext(this);
            type FindFirstResult = Prisma.Result<
              T,
              { where: TWhere; select: TSelect },
              'findFirst'
            >;

            const select = args?.select ?? { id: true as const };
            let where = args?.where ?? {};

            let numRows = (await (context as any).count({ where })) as number;

            const rows: Array<NonNullable<FindFirstResult>> = [];
            const rowIds: string[] = [];

            where = {
              ...where,
              id: { notIn: rowIds },
            };

            for (let i = 0; i < num && numRows > 0; ++i) {
              const row = (await (context as any).findFirst({
                select,
                where,
                skip: Math.max(0, Math.floor(Math.random() * numRows)),
              })) as FindFirstResult;

              if (!row) {
                console.error(
                  `get random row failed. Where clause: ${JSON.stringify(
                    where,
                  )}`,
                );
                break;
              }
              rows.push(row);
              rowIds.push((row as unknown as { id: string }).id);
              numRows--;
            }

            return rows;
          },
        },
      },
    });
  });
