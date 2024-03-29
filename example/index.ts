import { PrismaClient } from '@prisma/client';
import prismaRandom from '../dist/esm/index';

export const prisma = new PrismaClient().$extends(prismaRandom());
