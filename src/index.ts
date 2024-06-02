import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { AnyRouter, TRPCError } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { ZodError } from 'zod';

type CreateRemixCallerParams<Ctx, CallerResponse> = {
  caller: (ctx: Ctx) => CallerResponse;
  adapter: (request: Request) => Promise<Ctx>;
  onContextReady?: (ctx: Ctx) => Promise<void>;
};

export const createRemixCaller =
  <Ctx, CallerResponse>({
    caller,
    adapter,
    onContextReady,
  }: CreateRemixCallerParams<Ctx, CallerResponse>): RemixCaller<CallerResponse> =>
  async (request: Request) => {
    const ctx = await adapter(request);
    if (onContextReady) {
      await onContextReady(ctx);
    }
    return caller(ctx);
  };

type RemixCaller<CallerResponse> = (request: Request) => Promise<CallerResponse>;

export const createSafeRemixCaller = <Ctx, CallerResponse>({
  caller,
  adapter,
  onContextReady,
}: CreateRemixCallerParams<Ctx, CallerResponse>) => {
  const remixCaller = createRemixCaller({ caller, adapter, onContextReady });
  return async <R>(request: Request, callBack: (caller: CallerResponse) => Promise<R>) => {
    try {
      const caller = await remixCaller(request);
      const data = await callBack(caller);
      return { success: true, data } as const;
    } catch (error) {
      const err = error as TRPCError;
      if (err.cause && err.cause instanceof ZodError) {
        return { success: false, error: err.cause.flatten().fieldErrors } as const;
      }

      return {
        success: false,
        message: err.message,
        code: err.code,
        name: err.name,
        error: err.cause as unknown as Record<string, string>,
      } as const;
    }
  };
};

export type RemixHandlerAdapterArgs = FetchCreateContextFnOptions;

export const createTrpcRemixHandler =
  <Router extends AnyRouter, Ctx>({
    router,
    adapter,
    onContextReady,
    endpoint,
  }: {
    router: Router;
    adapter: (request: Request) => Promise<Ctx>;
    onContextReady?: (ctx: Ctx) => Promise<void>;
    endpoint: string;
  }) =>
  async (args: LoaderFunctionArgs | ActionFunctionArgs) => {
    const ctx = await adapter(args.request);
    if (onContextReady) {
      await onContextReady(ctx);
    }
    return fetchRequestHandler({
      endpoint,
      req: args.request,
      router,
      createContext: () => ctx,
    });
  };
