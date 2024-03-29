import { PrismaClient } from '@prisma/client';
import prismaRandom from '../dist';

export const prisma = new PrismaClient().$extends(prismaRandom());
