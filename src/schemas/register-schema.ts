import { z } from 'zod';
import { differenceInYears, isValid, parseISO } from 'date-fns';

export const registerSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
    firstName: z
      .string()
      .min(2, 'First name is required')
      .max(50, 'First name is too long')
      .regex(/^[a-zA-Z\s'-]+$/, 'First name must contain only letters, spaces, hyphens, or apostrophes'),
    lastName: z
      .string()
      .min(2, 'Last name is required')
      .max(50, 'Last name is too long')
      .regex(/^[a-zA-Z\s'-]+$/, 'First name must contain only letters, spaces, hyphens, or apostrophes'),
    dateOfBirth: z
      .string()
      .min(10, 'Date of birth is required')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
      .refine(
        value => {
          const date = parseISO(value);
          return isValid(date);
        },
        {
          message: 'Invalid date',
        }
      )
      .refine(
        value => {
          const date = parseISO(value);
          return differenceInYears(new Date(), date) >= 18;
        },
        {
          message: 'You must be at least 18 years old',
        }
      )
      .refine(
        value => {
          const date = parseISO(value);
          const age = differenceInYears(new Date(), date);
          return age <= 100;
        },
        { message: 'You seem a bit old, check your birth year.' }
      ),
    // phoneNumber: z.string().min(1, 'Phone number is required'),
    // acceptTerms: z.literal(true, 'You must accept the terms'),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
