import { PrismaClient } from '@prisma/client';

import prismaRandom from '../dist/index.js';
// import prismaRandom from '../src/index.js';

export const prisma = new PrismaClient().$extends(prismaRandom());
