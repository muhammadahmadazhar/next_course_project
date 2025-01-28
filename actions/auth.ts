'use server';

import { signIn } from '@/app/(auth)/auth';
import { SignInSchema } from '@/schemas';
import { PrismaClient } from '@prisma/client';
import { compare, hash } from 'bcrypt-ts';
import * as z from 'zod';


const prisma = new PrismaClient();

export interface RegisterActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'user_exists'
    | 'invalid_data';
}

// Prisma replacement for getUser function
async function getUser(email: string) {
  return await prisma.user.findUnique({
    where: {
      email
    }
  });
}

// Prisma replacement for createUser function
async function createUser(email: string, password: string, name: string) {
  return await prisma.user.create({
    data: {
      email,
      password, // Ensure password is hashed before storing
      name
    }
  });
}

export const register = async ({
  email,
  name,
  password
}: {
  email: string;
  name: string;
  password: string;
}): Promise<RegisterActionState> => {
  try {
    // Check if user already exists
    let user = await getUser(email);
    console.log('test', user);

    if (user) {
      return { status: 'user_exists' } as RegisterActionState;
    } else {
      // Hash password and create user with email, hashed password, and name
      const hashedPassword = await hash(password, 10);

      await createUser(email, hashedPassword, name);

      // // Automatically sign in the user after registration
      // await signIn('credentials', {
      //   email: email,
      //   password: password, // Use the original password here
      //   redirect: false
      // });

      return { status: 'success' };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error', error.errors);
      return { status: 'invalid_data' };
    }

    console.error('Unexpected error', error);
    return { status: 'failed' };
  }
};

export const logIn = async ({
  email,
  password
}: {
  email: string;
  password: string;
}): Promise<any> => {
  try {
    // Validate input data using the SignInSchema
    const validatedData = SignInSchema.safeParse({ email, password });
    if (!validatedData.success) {
      return {
        status: 'invalid_data',
        error: 'Invalid email or password format'
      };
    }

    // Check if user exists
    const user = await getUser(email);
    console.log("hello",user)
    if (!user) {
      return { status: 'user_not_found' }; // User does not exist
    }

    // Compare password with the hashed password in the database
    const isPasswordValid = await compare(password, user.password!); // Use compare here
    if (!isPasswordValid) {
      return { status: 'invalid_password', error: 'Invalid password' }; // Incorrect password
    }

    // If everything is valid, return success
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error', error.errors);
      return { status: 'invalid_data', error: 'Invalid input data' };
    }

    console.error('Unexpected error', error);
    return { status: 'failed', error: 'Unexpected error occurred' };
  }
  await signIn('credentials', {
    email: email,
    password: password, 
    redirectTo: '/task'
  });
  return { status: 'success' };
};
