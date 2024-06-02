import { createRemixCaller, createSafeRemixCaller, createTrpcRemixHandler } from 'trpc-remix-call';
import { z } from 'zod';
import { createApiContext, trpc } from './trpc.server';
let persistedName = 'World';

const setNameInput = z.object({
  name: z.string(),
});

const trpcRouter = trpc.router({
  hello: trpc.procedure.query(async () => {
    return { text: `Hello ${persistedName}` };
  }),
  setName: trpc.procedure.input(setNameInput).mutation(async ({ input: { name } }) => {
    persistedName = name;
    return { text: `Name set to ${name}` };
  }),
});
export type ApiRouter = typeof trpcRouter;
const apiCaller = trpc.createCallerFactory(trpcRouter);

export const remixCaller = createRemixCaller({
  adapter: createApiContext,
  caller: apiCaller,
});

export const safeRemixTrpcCall = createSafeRemixCaller({
  adapter: createApiContext,
  caller: apiCaller,
});

export const handleRequest = createTrpcRemixHandler({
  router: trpcRouter,
  adapter: createApiContext,
  endpoint: '/api',
});
