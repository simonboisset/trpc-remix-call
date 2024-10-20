import { TRPCError } from '@trpc/server';
import { TrpcFormatedError } from './types';

/**
 * Creates a new TRPCError with the given properties.
 * @param {TrpcFormatedError} props - The properties to create the error with.
 * @returns {TRPCError} A new TRPCError instance.
 */
export const createTrpcFormatedError = (props: TrpcFormatedError): TRPCError => {
  return new TRPCError({
    code: props.code,
    message: props.title,
    cause: props,
  });
};
