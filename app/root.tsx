import { Avatar, MenuItem } from "@mui/material";
import { cssBundleHref } from "@remix-run/css-bundle";
import { json, type LinksFunction, type LoaderArgs } from "@remix-run/node";
import { Links, LiveReload, NavLink, Outlet, isRouteErrorResponse, useLoaderData, useRouteError } from "@remix-run/react";
import { type PropsWithChildren } from "react";

import stylesheet from "~/tailwind.css";
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
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <Document>
      <header className="shadow-md">
        <nav className="py-2 px-4 bg-gradient-to-r from-emerald-500 to-sky-500">
          <div className="flex justify-between">
            <div className="flex">
              <div>
                <img className="pt-1 pl-4 wx-14 wy-14 w-5/6" src={'http://localhost:3000/emblem-light.png'} alt="emblem-logo" />
              </div>
              <MenuItem style={{ marginLeft: 18 }}>
                <NavLink to={`/`}>Home</NavLink>
              </MenuItem>
              <MenuItem>
                <NavLink to={`/products`}>Products</NavLink>
              </MenuItem>
              <MenuItem>
                <NavLink to={`/story`}>Our Story</NavLink>
              </MenuItem>
              <MenuItem>
                <NavLink to={`/faq`}>FAQ</NavLink>
              </MenuItem>
            </div>
            <div className="flex justify-end">
              {user ?
                <div className="flex">
                  <MenuItem>
                    <NavLink to={`/portal/home`}>Memorials</NavLink>
                  </MenuItem>
                  <MenuItem>
                    <NavLink to={`/portal/manage-profile`}>Profile</NavLink>
                  </MenuItem>
                  <Avatar sizes="" style={{ backgroundColor: 'rgb(253, 126, 151)' }}>{user.firstName[0]}{user.lastName[0]}</Avatar>
                </div>
                :
                <MenuItem>
                  <NavLink to={`/login`}>Sign In</NavLink>
                </MenuItem>
              }
            </div>
          </div>
        </nav>
      </header>
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