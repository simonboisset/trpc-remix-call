# trpc-formated-error

This package provides utility functions for handling and formatting TRPC errors in both client-side and server-side contexts. It extends the functionality of the `@trpc/client` and `@trpc/server` packages to provide a more structured and consistent error handling approach.

## Functions

### `createTrpcFormatedError(props: TrpcFormatedError): TRPCError`

Creates a new `TRPCError` instance with formatted properties.

- **Parameters:**
  - `props: TrpcFormatedError` - An object containing the properties for the formatted error.
- **Returns:** A new `TRPCError` instance.
- **Usage:**
  ```typescript
  const formattedError = createTrpcFormatedError({
    code: 'NOT_FOUND',
    title: 'Resource not found',
    // other TrpcFormatedError properties
  });
  ```

### `getClientFormatedError(error: unknown): TrpcFormatedError`

Extracts the formatted error from a client-side error object.

- **Parameters:**
  - `error: unknown` - The error object to extract the formatted error from.
- **Returns:** A `TrpcFormatedError` object.
- **Usage:**
  ```typescript
  try {
    // TRPC client call
  } catch (error) {
    const formattedError = getClientFormatedError(error);
    console.log(formattedError);
  }
  ```

### `trpcErrorFormatter({ shape, error }: { shape: DefaultErrorShape; error: TRPCError }): Object`

Formats a TRPC error for client-side consumption.

- **Parameters:**
  - `shape: DefaultErrorShape` - The default shape of the TRPC error.
  - `error: TRPCError` - The TRPC error instance.
- **Returns:** An object containing the formatted error information.
- **Usage:**
  ```typescript
  const formattedError = trpcErrorFormatter({
    shape: defaultErrorShape,
    error: trpcError,
  });
  ```

### `formatServerCallError(error: TRPCError): Promise<TrpcFormatedError>`

Formats a server-side TRPC error.

- **Parameters:**
  - `error: TRPCError` - The TRPC error to format.
- **Returns:** A promise that resolves to a `TrpcFormatedError` object.
- **Usage:**
  ```typescript
  try {
    // Server-side TRPC operation
  } catch (error) {
    if (error instanceof TRPCError) {
      const formattedError = await formatServerCallError(error);
      console.log(formattedError);
    }
  }
  ```

## Types

The package uses the following types:

- `TRPCClientError` from `@trpc/client`
- `DefaultErrorShape` and `TRPCError` from `@trpc/server`
- `TrpcFormatedError` (custom type defined in `./types`)

## Helper Functions

The package also includes a helper function:

- `getSafeCause` from `./safe-cause` - Used internally to safely extract the cause from an error object.

## Usage

To use this package in your TRPC-based application:

1. Install the package:

   ```
   npm install trpc-formated-error
   ```

2. Import the necessary functions in your TRPC server and client code:

   ```typescript
   import {
     createTrpcFormatedError,
     getClientFormatedError,
     trpcErrorFormatter,
     formatServerCallError,
   } from 'trpc-formated-error';
   ```

3. Use the functions as needed in your error handling logic for both client-side and server-side TRPC operations.

This package helps in standardizing error handling and formatting across your TRPC application, making it easier to manage and display errors consistently.
