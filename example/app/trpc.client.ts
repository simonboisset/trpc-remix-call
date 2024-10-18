import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { ApiRouter } from './api.server';

const trpcClient = createTRPCProxyClient<ApiRouter>({
  links: [
    httpBatchLink({
      url: `/api`,
    }),
  ],
  transformer: superjson,
});

export default trpcClient;
