import { z } from 'zod';

export const tenantInSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined ? 'Name is required' : 'Not a string',
    })
    .min(3, 'Name should be minimum of 3 characters'),
  address: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Address is required'
          : 'Provided address is not a string',
    })
    .min(3, 'Address should be minimum of 10 characters'),
});

export type TenantIn = z.infer<typeof tenantInSchema>;
