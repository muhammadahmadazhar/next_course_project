'use server'


import { PrismaClient } from '@prisma/client';
import { genSaltSync, hashSync } from "bcrypt-ts";
// import { config } from "dotenv";

// config({
//   path: ".env.local",
// });

// Initialize Prisma Client
const prisma = new PrismaClient();
interface CreateUserParams {
  email: string;
  password: string;
  name: string;
  organizationId: number;
}

export async function getUser(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

export async function createUser({
  email,
  password,
  name
}: CreateUserParams) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  try {
    return await prisma.user.create({
      data: {
        email,
        password: hash,
        name
      }
    });
  } catch (error) {
    console.error('Failed to create user in database');
    throw error;
  }
}

