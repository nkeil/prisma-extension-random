import { prisma } from './db';
import { assert, beforeEach, test } from 'vitest';

const POPULATION = 1000;
const NUM_TRIALS = 10000;

const STD_RATIO = 3.4641016151377544;

beforeEach(async () => {
  await prisma.user.deleteMany();
  for (let i = 1; i <= POPULATION; ++i) {
    await prisma.user.create({
      data: {
        firstName: 'User',
        lastName: i.toString(),
      },
    });
  }
});

test('empty findRandom', async () => {
  await prisma.user.deleteMany();
  const user = await prisma.user.findRandom();
  assert.isNull(user);
});

test('findRandom', async () => {
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
      .map((idx) => results[idx] * Math.pow(+idx - mean, 2))
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