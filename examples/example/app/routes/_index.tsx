import type {ActionFunctionArgs, LoaderFunctionArgs} from '@remix-run/node';
import {Form, useLoaderData} from '@remix-run/react';
import {remixCaller} from '~/api.server';

export const loader = async (args: LoaderFunctionArgs) => {
  const caller = await remixCaller(args.request);
  const message = await caller.hello();
  return {message};
};

export const action = async (args: ActionFunctionArgs) => {
  const caller = await remixCaller(args.request);
  const formData = await args.request.formData();
  const name = formData.get('name') as string;

  const message = await caller.setName({name});
  return {message};
};

export default function Index() {
  const {message} = useLoaderData<typeof loader>();
  return (
    <div style={{fontFamily: 'system-ui, sans-serif', lineHeight: '1.8'}}>
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
