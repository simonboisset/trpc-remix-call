import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import superjson from 'superjson';

export const createApiContext = async (req: Request) => {
  const host = req.headers.get('host') || '';
  const domainProtocol = host === 'localhost:3000' ? 'http' : 'https';
  const domain = `${domainProtocol}://${host}`;
  const ip =
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for') ||
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-client-ip') ||
    'unknown';

  return { domain, host, ip };
};

export type ApiContext = inferAsyncReturnType<typeof createApiContext>;

export const trpc = initTRPC.context<ApiContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return { ...shape };
  },
});
