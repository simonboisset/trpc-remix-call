import { useQuery } from '@tanstack/react-query';
import { getClientFormatedError } from 'trpc-formated-error';
import trpcClient from '~/trpc.client';



export default function Index() {
  const {error,isLoading} = useQuery({queryKey: ['error'], queryFn:() => trpcClient.error.query()});
  const cause =error? getClientFormatedError(error):null;
  return (
    <div style={{fontFamily: 'system-ui, sans-serif', lineHeight: '1.8'}}>
      {isLoading ? <p>Loading...</p> : cause && (
        <>
          <h1>{cause.title}</h1>
          <p>{cause.description}</p>
          <ul>{cause.reasons?.map(reason => <li key={reason.key}>{reason.message}</li>)}</ul>
        </>
      )}
    </div>
  );
}
