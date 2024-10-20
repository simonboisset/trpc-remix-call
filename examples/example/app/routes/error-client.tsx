import { ClientLoaderFunctionArgs, useLoaderData } from '@remix-run/react';
import { getClientFormatedError } from 'trpc-formated-error';
import { queryClient } from '~/query-client';
import trpcClient from '~/trpc.client';

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
  try {
    await queryClient.fetchQuery({queryKey: ['error'], queryFn:() => trpcClient.error.query()});
  } catch (error) {
    const cause = getClientFormatedError(error);
    return {error: cause};
  }

  return {error: null};
};

export default function Index() {
  const {error} = useLoaderData<typeof clientLoader>();
  return (
    <div style={{fontFamily: 'system-ui, sans-serif', lineHeight: '1.8'}}>
      {error && (
        <>
          <h1>{error.title}</h1>
          <p>{error.description}</p>
          <ul>{error.reasons?.map(reason => <li key={reason.key}>{reason.message}</li>)}</ul>
        </>
      )}
    </div>
  );
}
