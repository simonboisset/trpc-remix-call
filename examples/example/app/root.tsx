import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './query-client';

export function Layout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <nav>
            <ul style={{display: 'flex', listStyle: 'none', padding: 0}}>
              <li style={{marginRight: '1rem'}}>
                <a href="/">Server Call</a>
              </li>
              <li style={{marginRight: '1rem'}}>
                <a href="/client-call">Client Call</a>
              </li>
              <li style={{marginRight: '1rem'}}>
                <a href="/component-call">Component Call</a>
              </li>
              <li style={{marginRight: '1rem'}}>
                <a href="/error">Error</a>
              </li>
              <li style={{marginRight: '1rem'}}>
                <a href="/error-client">Error Client</a>
              </li>
              <li style={{marginRight: '1rem'}}>
                <a href="/error-component">Error Component</a>
              </li>
            </ul>
          </nav>
          {children}
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
