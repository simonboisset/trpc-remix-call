import { Form } from '@remix-run/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import trpcClient from '~/trpc.client';

export default function Index() {
  const [name, setName] = useState('');

  const { data: message, isLoading } = useQuery({ queryFn: () => trpcClient.hello.query(), queryKey: ['hello'] });
  const { mutate } = useMutation({ mutationFn: (name: string) => trpcClient.setName.mutate({ name }) });

  const queryClient = useQueryClient();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(name, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['hello'] });
      },
    });
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      {isLoading ? <p>Loading...</p> : <h1>{message?.text}</h1>}
      <Form onSubmit={handleSubmit}>
        <label>
          Name:
          <input name="name" required onChange={(e) => setName(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
