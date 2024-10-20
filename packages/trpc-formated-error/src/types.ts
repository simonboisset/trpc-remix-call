import { TRPC_ERROR_CODE_KEY, TRPC_ERROR_CODES_BY_KEY } from '@trpc/server/rpc';
import { z } from 'zod';

/**
 * Zod schema for validating the structure of a TRPC error.
 */
export const formatedErrorSchema = z.object({
  id: z.string(),
  title: z.string(),
  code: z.enum(Object.keys(TRPC_ERROR_CODES_BY_KEY) as [TRPC_ERROR_CODE_KEY]),
  description: z.string().optional(),
  reasons: z.array(z.object({ key: z.string(), message: z.string() })).optional(),
});

/**
 * Type definition for a TRPC error, inferred from the formatedErrorSchema.
 */
export type TrpcFormatedError = z.infer<typeof formatedErrorSchema>;

/**
 * Default error to use when no valid is provided.
 */
export const defaultFormatedError: TrpcFormatedError = {
  id: 'unknown',
  code: 'INTERNAL_SERVER_ERROR',
  title: 'Unknown error',
};
