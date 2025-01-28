
import * as z from 'zod';

const emailValidator = z
  .string()
  .trim()
  .email({
    message: 'Enter a valid email address'
  })
  .transform((email) => email.toLowerCase());

export const RegisterSchema = z
  .object({
    email: emailValidator,
    password: z.string().trim().min(8, {
      message: 'Minimum 8 characters required'
    }),
    name: z.string().trim().min(1, {
      message: 'Name is required'
    })
  })
  .refine(
    (val) => {
      const hasUpperCase = /[A-Z]/.test(val.password);
      const hasLowerCase = /[a-z]/.test(val.password);
      const hasNumber = /[0-9]/.test(val.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(val.password);

      return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    },
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      path: ['password']
    }
  );
export const SignInSchema = z.object({
  email: emailValidator,
  password: z.string().trim().min(1, {
    message: 'Password is required'
  }) // Only check if the password is not empty
});
