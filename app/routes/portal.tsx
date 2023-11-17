import { json, type LoaderArgs } from "@remix-run/node";
import { Outlet, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import PortalSidenav from "~/components/portalSidenav";
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
      <PortalSidenav />
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