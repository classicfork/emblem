import { Outlet, NavLink, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import { type LoaderArgs, json } from "@remix-run/node";
import { getUser } from "~/utils/session.server";


export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await getUser(request);

  if (!user) {
    throw ('No user found.');
  }

  return json({ user });
}

export default function ManageProfileMemorialRoute() {
  return (
    <>
      <nav className="fixed h-screen border-r-2 shadow-md">
        <ul>
          <li className="px-6 py-4">
            <NavLink className="flex flex-1 flex-col" to={`/portal/home`}>Memorials</NavLink>
          </li>
          <li className="px-6 py-4">
            <NavLink className="flex flex-1 flex-col" to={`/portal/manage-profile`}>Manage Profile</NavLink>
          </li>
          <li className="px-6 py-4">
            <NavLink className="flex flex-1 flex-col" to={`/portal/manage-profile/password`}>Password</NavLink>
          </li>

          <li className="px-6 py-4">
            <NavLink
              to={`/portal/manage-profile/subscription`}
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >Subscription</NavLink>
          </li>
          <li className="px-6 py-4">
            <NavLink className="flex flex-1 flex-col mt-auto" to={`/logout`}>Logout</NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export function ErrorBoundary() {
  const { error }: any = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main
        title={`${error.status} ${error.statusText}`}
      >
        <div className="error-container justify-center">
          <h1>
            {error.status} {error.statusText}
          </h1>
        </div>
      </main>
    );
  }
}