# trpc-remix-call

Trpc adapter for Remix with api handler and server side call.

## Example

Check the full example in here: [trpc-remix-example](/example/)

## Introduction

As a Remix and trpc user, I wanted to use both together nicely but I didn't found any library to do it simply.
Typically, I use client side calls with trpc for my mobile app, server side calls with trpc for my web app.
In order to achieve this, I had to create redundant code to get my trpc context each time.

This package provides a simple way to use trpc with Remix in few lines of code and let you focus on your business logic.

Feel free to open an issue if you have any problem. Any feedback is welcome.

## Install

```
npm install trpc-remix-call
```

## Define your context

Start by defining your context with a function that gets the Request and returns the context.

```ts
export const createApiContext = async (req: Request) => {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') || null;

  return { token };
};

export type ApiContext = Awaited<ReturnType<typeof createApiContext>>;
```

## API handler

After that, you can create your api handler.

```ts
import { createTrpcRemixHandler } from 'trpc-remix-call';

export const handleRequest = createTrpcRemixHandler({
  router: trpcRouter,
  adapter: createApiContext,
  endpoint: '/api',
});
```

Now, create your api route file `api.$trpc` and export the `loader` and `action` functions.

```ts
export const loader = async (args: LoaderFunctionArgs) => {
  return apiRemixHandler(args);
};
export const action = async (args: ActionFunctionArgs) => {
  return apiRemixHandler(args);
};
```

That's it for the client side. You can now use the api handler within your client side code.

## Server side call

For server side calls, you can reuse the context function you created earlier and create the trpc caller from the trpc router.

```ts
const apiCaller = trpc.createCallerFactory(trpcRouter);
```

Whit that done, you can call your api server side in your loader or action.

```ts
import { createRemixCaller, createSafeRemixCaller } from 'trpc-remix-call';

export const remixCaller = createRemixCaller({ adapter: createApiContext, caller: apiCaller });
export const safeRemixCaller = createSafeRemixCaller({ adapter: createApiContext, caller: apiCaller, formatError });

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

## On context ready hook

You can also use the `onContextReady` hook to execute some code when the context is ready and before the api handler is called.

```ts
import { createTrpcRemixHandler } from 'trpc-remix-call';

const apiRemixHandler = createTrpcRemixHandler({
  endpoint: '/api',
  router: trpcRouter,
  adapter: createApiContext,
  onContextReady: async (context) => {
    // Do something with the context before the api handler is called
  },
});
```

Same for the server side call.

```ts
import { createRemixCaller, createSafeRemixCaller } from 'trpc-remix-call';

export const remixCaller = createRemixCaller({
  adapter: createApiContext,
  caller: apiCaller,
  onContextReady: async (context) => {
    // Do something with the context before the api handler is called
  },
});

export const safeRemixCaller = createSafeRemixCaller({
  adapter: createApiContext,
  caller: apiCaller,
  onContextReady: async (context) => {
    // Do something with the context before the api handler is called
  },
  formatError,
});
```

## Format error for safeRemixCaller

You need to provide a format error function to the `createSafeRemixCaller` function.

A simple format error function can be:

```ts
const formatError = (error: TRPCError) => ({
  message: error.message,
  code: error.code,
  name: error.name,
});
```
