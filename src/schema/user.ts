import { z } from 'zod';

export const registerUserSchema = z.object({
  firstName: z
    .string({
      error: (issue) =>
        issue.input === undefined ? 'The field is required' : 'Not a string',
    })
    .min(3, 'First name should be minimum of 3 characters'),
  lastName: z
    .string({
      error: (issue) =>
        issue.input === undefined ? 'The field is required' : 'Not a string',
    })
    .min(3, 'Last name should be minimum of 3 characters'),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
