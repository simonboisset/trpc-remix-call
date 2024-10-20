import { ZodError } from 'zod';
import { TrpcFormatedError, defaultFormatedError, formatedErrorSchema } from './types';

/**
 * Safely parses the given cause and returns a valid TrpcFormatedError.
 * @param {unknown} cause - The cause to parse.
 * @returns {TrpcFormatedError} A valid TrpcFormatedError object.
 */
export const getSafeCause = (cause: unknown): TrpcFormatedError => {
  if (!cause) {
    console.error('No cause found');
    return defaultFormatedError;
  }

  if (cause instanceof ZodError) {
    const reasons = cause.errors.map((e) => ({ key: e.path.join('.'), message: e.message }));
    console.log('reasons', reasons[0]);

    return {
      id: 'trpc-input-validation',
      code: 'BAD_REQUEST',
      title: 'Invalid input',
      description: 'The input is invalid',
      reasons,
    };
  }

  const result = formatedErrorSchema.safeParse(cause);
  if (result.success) {
    return result.data;
  }
  console.error('Invalid error cause', cause);
  return defaultFormatedError;
};
