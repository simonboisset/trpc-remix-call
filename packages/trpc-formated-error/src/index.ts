import { TRPCClientError } from '@trpc/client';
import { DefaultErrorShape, TRPCError } from '@trpc/server';
import { getSafeCause } from './safe-cause';
import { TrpcFormatedError } from './types';
export * from './create-formated-error';
/**
 * Extracts the formated error from a client error.
 * @param {unknown} error - The error to extract the formated error from.
 * @returns {TrpcFormatedError} The extracted formated error.
 */
export const getClientFormatedError = (error: unknown): TrpcFormatedError => {
  if (error instanceof TRPCClientError) {
    return getSafeCause(error.shape.cause);
  }
  return getSafeCause(null);
};

/**
 * Formats a TRPC error for client-side consumption.
 * @param {Object} params - The parameters for formatting the error.
 * @param {DefaultErrorShape} params.shape - The shape of the error.
 * @param {TRPCError} params.error - The TRPC error instance.
 * @returns {Object} The formatted error object.
 */
export const trpcErrorFormatter = ({ shape, error }: { shape: DefaultErrorShape; error: TRPCError }) => {
  return { ...shape, cause: getSafeCause(error.cause) };
};

/**
 * Formats a server-side TRPC error.
 * @param {TRPCError} error - The TRPC error to format.
 * @returns {Promise<TrpcFormatedError>} A promise that resolves to the formatted formated error.
 */
export const formatServerCallError = async (error: TRPCError): Promise<TrpcFormatedError> => {
  return getSafeCause(error.cause);
};
