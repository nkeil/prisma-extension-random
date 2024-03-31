import { PrismaClient } from '@prisma/client';
import prismaRandom from '../dist/index.js';

export const prisma = new PrismaClient().$extends(prismaRandom());
