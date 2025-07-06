import prisma from '@/config/prisma-client';

export const findByEmail = (emailAddress: string) =>
  prisma.user.findUnique({ where: { emailAddress } });

export const findById = (id: string) => prisma.user.findUnique({ where: { id } });

export const findByusername = (username: string) => prisma.user.findUnique({ where: { username } });

export const findByPhoneNumber = (phoneNumber: string) =>
  prisma.user.findUnique({ where: { phoneNumber } });
