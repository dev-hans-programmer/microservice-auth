import { z } from 'zod';
import { Roles } from '../utils/constants.util';

export const userInSchema = z.object({
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

  email: z.preprocess(
    (val) => (typeof val === 'string' ? val.trim() : val),
    z
      .email({
        error: (issue) =>
          issue.input === undefined ? 'Email is required' : 'Not an email',
      })
      .toLowerCase(),
  ),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined ? 'Password is required' : 'Not a string',
    })
    .min(6, 'Password should be of minimum 6 characters'),
  role: z.enum(Object.values(Roles), {
    error: (issue) =>
      issue.input === undefined ? 'Role is required' : 'Invalid value for role',
  }),
  tenantId: z.number({
    error: (issue) =>
      issue.input === undefined
        ? 'TenantId is required'
        : 'Invalid value for tenantId',
  }),
});

export type UserIn = z.infer<typeof userInSchema>;
