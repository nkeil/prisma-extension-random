import { Prisma } from '@prisma/client';
import { $findManyRandom, $findRandom } from './helpers.js';

type Args = {};

export default (_extensionArgs?: Args) =>
  Prisma.getExtensionContext({
    name: 'prisma-extension-random',
    model: {
      $allModels: {
        async findRandom<T, A>(
          this: T,
          args?: Prisma.Exact<A, Prisma.Args<T, 'findFirst'>> & object,
        ) {
          const context = Prisma.getExtensionContext(this);

          return (await $findRandom(
            context as any,
            args as any,
          )) as Prisma.Result<T, A, 'findFirst'>;
        },

        async findManyRandom<T, TWhere, TSelect, TUnique extends string = 'id'>(
          this: T,
          num: number,
          args?: {
            where?: Prisma.Exact<TWhere, Prisma.Args<T, 'findFirst'>['where']>;
            select?: Prisma.Exact<
              TSelect,
              Prisma.Args<T, 'findFirst'>['select']
            >;
            custom_uniqueKey?: TUnique; // TODO: add intellisense?
          },
        ) {
          const context = Prisma.getExtensionContext(this);
          type ExtendedSelect = TSelect & Record<TUnique, true>;

          return (await $findManyRandom(
            context as any,
            num,
            args as any,
          )) as Array<
            NonNullable<
              Prisma.Result<
                T,
                { where: TWhere; select: ExtendedSelect },
                'findFirst'
              >
            >
          >;
        },
      },
    },
  });
