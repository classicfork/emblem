import { cssBundleHref } from "@remix-run/css-bundle";
import { json, type LinksFunction, type LoaderArgs } from "@remix-run/node";
import { isRouteErrorResponse, Links, LiveReload, Outlet, Scripts, ScrollRestoration, useLoaderData, useRouteError } from "@remix-run/react";
import { type PropsWithChildren } from "react";

import stylesheet from "~/tailwind.css";
import Header from "./components/header";
import { getUser } from "./utils/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await getUser(request);
  debugger;

  return json({ user });
}

function Document({
  children,
  title = "Emblem Memorial",
}: PropsWithChildren<{ title?: string }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />
        <title>{title}</title>
        <Links />
      </head>
      <body className="overflow-y-hidden mb-16">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const shouldRevalidate = () => false;

export default function App() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <Document>
      <Header user={user} />
      <main style={{ overflowY: 'scroll', height: '94vh', position: 'relative' }}>
        <Outlet />
      </main>
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Document
        title={`${error.status} ${error.statusText}`}
      >
        <div className="error-container">
          <h1>
            {error.status} {error.statusText}
          </h1>
        </div>
      </Document>
    );
  }

  const errorMessage =
    error instanceof Error
      ? error.message
      : "Unknown error";
  return (
    <Document title="Uh-oh!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{errorMessage}</pre>
      </div>
    </Document>
  );
}