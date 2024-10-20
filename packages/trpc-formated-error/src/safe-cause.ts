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

  const result = formatedErrorSchema.safeParse(cause);
  if (result.success) {
    return result.data;
  }
  console.error('Invalid error cause', cause);
  return defaultFormatedError;
};
