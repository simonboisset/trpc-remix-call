import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { ApiRouter, handleRequest } from '~/api.server';

export const loader = async (args: LoaderFunctionArgs) => {
  return handleRequest(args);
};
export const action = async (args: ActionFunctionArgs) => {
  return handleRequest(args);
};

// To use this loader in your app, you can react components you need to create apiClient :
// This is for client side calls. For server side calls, you have to use `remixCaller` directly in loader or action.

export const apiClient = createTRPCProxyClient<ApiRouter>({
  links: [httpBatchLink({ url: '/api' })],
  transformer: superjson,
});
