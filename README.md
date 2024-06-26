<div align="center">
  <img src="logo.svg" width="200px" align="center" alt="zod-redis logo" />
  <h1>🎲 prisma-extension-random 🎲</h1>
  <h3>Let me tell you the definition of insanity...</h3>
</div>

Bored of fetching the same old data from your database over and over again? Tired of subscribing to 3 year old GitHub issue threads waiting for Prisma to add that feature you want? Well I've got just what you need! Spice up your life with `prisma-extension-random`, your one stop shop for all your random query needs. 

## Features

- Random row retrieval: easily retrieve a random row from your database table using `findRandom()`.
- Random multi-row retrieval: use `findManyRandom()` to query for a random subset of a `findMany()` query.

## Installation

```bash
npm install prisma-extension-random
yarn add prisma-extension-random
bun add prisma-extension-random
pnpm add prisma-extension-random
```

## Usage

1. Import the extension and add it to your Prisma client:

```typescript
import { PrismaClient } from '@prisma/client';
import prismaRandom from 'prisma-extension-random';

const prisma = new PrismaClient().$extends(prismaRandom());
```

2. Use the `findRandom` method to fetch random rows from your database:

```typescript
// Find a random post from an author whose firstname starts with "B"
const post = await prisma.post.findRandom({
  select: { id: true, title: true },
  where: { author: { firstName: { startsWith: 'B' } } },
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

Note: when using models with a non-standard id field, you must specify the name of that field using `custom_uniqueKey` as below. If not specified, the name is assumed to be "id".

```typescript
// Assuming the User table's `@id` column is called 'email'
const users = await prisma.user.findManyRandom(5, {
  select: { name: true },
  custom_uniqueKey: 'email',
});
```

## Contributing

Issues and pull requests are welcome. I'll review them as soon as possible!
