import { prisma } from './db.js';
import { assert, beforeEach, expect, expectTypeOf, test } from 'vitest';

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface Post {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
}

interface Strange {
  key: number;
  value: string;
}

const POPULATION = 1000;
const NUM_TRIALS = 10000;

const STD_RATIO = 3.4641016151377544;

beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
  await prisma.strange.deleteMany();

  for (let i = 1; i <= POPULATION; ++i) {
    const user = await prisma.user.create({
      data: {
        firstName: 'User' + (i % 2),
        lastName: i.toString(),
      },
    });
    for (let i = 1; i <= 1; ++i) {
      await prisma.post.create({
        data: {
          author: { connect: { id: user.id } },
          title: 'Title',
        },
      });
    }
  }
  for (let i = 1; i <= 10; ++i) {
    await prisma.strange.create({
      data: { value: 'value ' + i },
    });
  }
});

test('empty findRandom', async () => {
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
  await prisma.strange.deleteMany();

  const user = await prisma.user.findRandom();
  const post = await prisma.post.findRandom();
  const strange = await prisma.strange.findRandom();

  expectTypeOf(user).toMatchTypeOf<User | null>();
  expectTypeOf(post).toMatchTypeOf<Post | null>();
  expectTypeOf(strange).toMatchTypeOf<Strange | null>();

  assert.isNull(user);
  assert.isNull(post);
  assert.isNull(strange);
});

test('empty findManyRandom', async () => {
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
  await prisma.strange.deleteMany();

  const users = await prisma.user.findManyRandom(10000);
  const posts = await prisma.post.findManyRandom(10000);

  expectTypeOf(users).toMatchTypeOf<{ id: number }[]>();
  expectTypeOf(posts).toMatchTypeOf<{ id: number }[]>();

  assert.isEmpty(users);
  assert.isEmpty(posts);

  // 'strange' table doesn't have an `id` column, so this should fail
  expect(
    async () => await prisma.strange.findManyRandom(10000),
  ).rejects.toThrowError();
});

test('custom unique key', async () => {
  const strange = await prisma.strange.findManyRandom(5, {
    custom_uniqueKey: 'key',
  });

  expectTypeOf(strange).toMatchTypeOf<{ key: number }[]>();
  assert(strange.length === 5);
  assert(
    strange[0] && 'key' in strange[0] && typeof strange[0].key === 'number',
  );
});

test('findRandom distribution', async () => {
  const results: Record<string, number> = {};
  let sum = 0;
  for (let i = 0; i < NUM_TRIALS; ++i) {
    const user = await prisma.user.findRandom();
    if (!user) assert.fail('findRandom returned null');
    sum += +user.lastName;
    results[user.lastName] = (results[user.lastName] ?? 0) + 1;
  }

  // Make sure that every user was hit
  for (let i = 1; i <= POPULATION; ++i) {
    assert.property(results, i.toString());
  }

  const mean = sum / NUM_TRIALS;
  const std = Math.sqrt(
    Object.keys(results)
      .map((idx) => (results[idx] ?? 0) * Math.pow(+idx - mean, 2))
      .reduce((a, b) => a + b) / NUM_TRIALS,
  );
  console.log({ mean, std });

  // Expected (based on a standard uniform distribution)
  const expectedMean = POPULATION / 2;
  const expectedStd = POPULATION / STD_RATIO;

  assert.isBelow(mean, expectedMean * 1.02);
  assert.isAbove(mean, expectedMean * 0.98);

  assert.isBelow(std, expectedStd * 1.01);
  assert.isAbove(std, expectedStd * 0.99);
});

test('findManyRandom', async () => {
  const users1 = await prisma.user.findManyRandom(POPULATION, {
    where: { firstName: 'User0' },
  });
  assert.lengthOf(users1, POPULATION / 2);

  const users2 = await prisma.user.findManyRandom(POPULATION + 10009);
  assert.lengthOf(users2, POPULATION);
});

test('findRandom filtered', async () => {
  const users1 = await prisma.user.findRandom({
    where: { firstName: 'User0' },
  });
  assert.isNotNull(users1);
  assert.equal(users1?.firstName, 'User0');
});
