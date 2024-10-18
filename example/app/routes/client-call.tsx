import { ClientActionFunctionArgs, Form, useLoaderData } from '@remix-run/react';
import { queryClient } from '~/query-client';
import trpcClient from '~/trpc.client';

export const clientLoader = async () => {
  const { text } = await queryClient.fetchQuery({ queryFn: () => trpcClient.hello.query(), queryKey: ['hello'] });
  console.log('clientLoader', text);

  return { message: { text } };
};

export const clientAction = async (args: ClientActionFunctionArgs) => {
  const formData = await args.request.formData();
  const name = formData.get('name') as string;

  await trpcClient.setName.mutate({ name });
  await queryClient.invalidateQueries({ queryKey: ['hello'] });

  return { message: 'ok' };
};

export default function Index() {
  const { message } = useLoaderData<typeof clientLoader>();
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>{message.text}</h1>
      <Form method="post">
        <label>
          Name:
          <input name="name" required />
        </label>
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
