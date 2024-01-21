# trpc-remix-call

Trpc adapter form Remix with api handler and server side call.

## Introduction

As a Remix and trpc user, I wanted to use both together but I didn't find any easy way to do it simply.
Typically, I use client side call with trpc for my mobile app and server side call with trpc for my web app but this need many redundant code to get context each time.

This package provide a simple way to use trpc with Remix in few lines of code.

Feel free to open an issue if you have any problem. Any feedback is welcome.

## Install

```
npm install trpc-remix-call
```

## Api handler

First you need to create an adapter for your api handler. This adapter must return the trpc context.

```ts
import type { RemixHandlerAdapterArgs } from 'trpc-remix-call';

const remixHandlerAdapter = ({ req }: RemixHandlerAdapterArgs): ApiContext => {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || null;

  return { token };
};
```

Now you can create your api handler.

```ts
import { createTrpcRemixHandler } from 'trpc-remix-call';

const apiRemixHandler = createTrpcRemixHandler({
  endpoint: '/api',
  router: apiRouter,
  adapter: remixHandlerAdapter,
});
```

Create your api route file `api.$trpc` and export `loader` and `action`.

```ts
export const loader = async (args: LoaderFunctionArgs) => {
  return apiRemixHandler(args);
};
export const action = async (args: ActionFunctionArgs) => {
  return apiRemixHandler(args);
};
```

That's it, you can now use your api handler with your trpc client.

## Server side call

You can also use the api handler to call your api server side.

Same as before, you need to create an adapter for your api handler.

```ts
export const remixServerSideAdapteur = async (request: Request): Promise<ApiContext> => {
  const token = await getTokenFromRequest(request);

  return { token };
};
```

Also create your trpc api caller.

```ts
const trpcCaller = trpc.createCallerFactory(trpcRouter);
```

Now you can call your api server side in your loader or action.

```ts
import { createRemixCaller, createSafeRemixCaller } from 'trpc-remix-call';

export const remixCaller = createRemixCaller({ adapter: remixAdapteur, caller: apiCaller });
export const safeRemixCaller = createSafeRemixCaller({ adapter: remixAdapteur, caller: apiCaller });

// Example with remixCaller
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const caller = await remixCaller(request);
    const result = await caller.auth.signup(data);

    return json(result);
  } catch (e) {
    return json(e);
  }
};

// Example with safeRemixCaller
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const safeResult = await safeRemixCaller(request, (caller) => caller.auth.signup(data));
  const result = await caller.auth.signup(data);

  if (getCurrentUser.success) {
    return json(result.data);
  }

  return json({
    error: result.error,
    message: result.message,
    code: result.code,
  });
};
```
