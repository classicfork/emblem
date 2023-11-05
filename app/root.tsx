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

export const shouldRevalidate = () => false;

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
              <NavLink style={{ color: 'white' }} to={`/`}>
                <MenuItem style={{ marginLeft: 18 }}>
                  Home
                </MenuItem>
              </NavLink>
              <NavLink style={{ color: 'white' }} to={`/products`}>
                <MenuItem>
                  Products
                </MenuItem>
              </NavLink>
              <NavLink style={{ color: 'white' }} to={`/story`}>
                <MenuItem>
                  Our Story
                </MenuItem>
              </NavLink>
              <NavLink style={{ color: 'white' }} to={`/faq`}>
                <MenuItem>
                  FAQ
                </MenuItem>
              </NavLink>
            </div>
            <div className="flex justify-end">
              {user ?
                <div className="flex">
                  <NavLink style={{ color: 'white' }} to={`/portal/home`}>
                    <MenuItem>
                      Profile
                    </MenuItem>
                  </NavLink>
                  <Avatar style={{ background: 'rgb(255,157,43)'}}>{user.firstName[0]}{user.lastName[0]}</Avatar>
                </div>
                :
                <NavLink style={{ color: 'white' }} to={`/login`}>
                  <MenuItem>
                    Sign In
                  </MenuItem>
                </NavLink>
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