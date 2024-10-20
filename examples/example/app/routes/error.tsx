import type {LoaderFunctionArgs} from '@remix-run/node';
import {useLoaderData} from '@remix-run/react';
import {safeRemixTrpcCall} from '~/api.server';

export const loader = async (args: LoaderFunctionArgs) => {
  const {data, error, success} = await safeRemixTrpcCall(args.request, t => t.error());
  return {error};
};

export default function Index() {
  const {error} = useLoaderData<typeof loader>();
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
