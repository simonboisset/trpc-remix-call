import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { AnyRouter, TRPCError } from '@trpc/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

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

type CreateSafeRemixCallerParams<Ctx, CallerResponse, Err> = CreateRemixCallerParams<Ctx, CallerResponse> & {
  formatError: (error: TRPCError) => Promise<Err>;
};

export const createSafeRemixCaller = <Ctx, CallerResponse, Err>({
  caller,
  adapter,
  onContextReady,
  formatError,
}: CreateSafeRemixCallerParams<Ctx, CallerResponse, Err>) => {
  const remixCaller = createRemixCaller({ caller, adapter, onContextReady });
  return async <Res>(request: Request, callBack: (caller: CallerResponse) => Promise<Res>) => {
    try {
      const caller = await remixCaller(request);
      const data = await callBack(caller);

      return { success: true, data, error: null } as const;
    } catch (err) {
      const error = await formatError(err as TRPCError);

      return { success: false, error, data: null } as const;
    }
  };
};

type CreateRemixHandlerParams<Router extends AnyRouter, Ctx> = {
  router: Router;
  adapter: (request: Request) => Promise<Ctx>;
  onContextReady?: (ctx: Ctx) => Promise<void>;
  endpoint: string;
};

export const createTrpcRemixHandler =
  <Router extends AnyRouter, Ctx>({
    router,
    adapter,
    onContextReady,
    endpoint,
  }: CreateRemixHandlerParams<Router, Ctx>) =>
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
