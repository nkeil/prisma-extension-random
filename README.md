# Randomness Extension for Prisma

`prisma-extension-random` is a Prisma Client Extension that simplifies the process of fetching random data from your database.

## Features

- Random Row Retrieval: easily retrieve a random row from your database table using `table.findRandom()`.
- Random Row Subset retrieval: use `table.findManyRandom()` to query for a customized random row subset of an arbitrary `findMany()` query.

## Installation

Install the Prisma Random Query Extension using your favorite npm package manager:

```bash
npm install prisma-extension-random       # npm
yarn add prisma-extension-random          # yarn
bun add prisma-extension-random           # bun
pnpm add prisma-extension-random          # pnpm
```

## Usage

1. Import the extension and add it to your Prisma client:

```typescript
import { PrismaClient } from "@prisma/client";
import prismaRandom from "prisma-extension-random";

const prisma = new PrismaClient().$extends(prismaRandom());
```

2. Use the `findRandom` method to fetch random rows from your database:

```typescript
// Find a random post from an author whose firstname starts with "B"
const post = await prisma.post.findRandom({
  select: { id: true, title: true },
  where: { author: { firstName: { startsWith: "B" } } },
});
```

3. Use the `findManyRandom` method to fetch a random subset of rows from a `findMany`-esque query.

```typescript
// Find 5 random movies with a rating greater than 0.8
const movies = await prisma.movie.findManyRandom(5, {
  select: { id: true, title: true },
  where: { rating: { gte: 0.8 } },
});
```

## Contributing

Issues and pull requests are welcome. I'll review them as soon as possible!
