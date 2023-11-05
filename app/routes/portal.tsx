import { Outlet, NavLink, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import { type LoaderArgs, json } from "@remix-run/node";
import { getUser } from "~/utils/session.server";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SecurityIcon from '@mui/icons-material/Security';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import LogoutIcon from '@mui/icons-material/Logout';

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
      <nav className="fixed pt-6 h-screen border-r-2 shadow-md">
        <ol>
        <li className="py-2">
            <NavLink 
              to={`/portal/home`}
              className={({ isActive, isPending }) =>
              isPending ? "px-6 py-4 flex flex-1 flex-col " : isActive ? "px-6 py-4 flex flex-1 flex-col bg-sky-50" : "px-6 py-4 flex flex-1 flex-col"
            }>
              <label className="hover:cursor-pointer"><AccountBalanceIcon className="flex align-text-bottom" fontSize="small" /> Memorials</label></NavLink>
          </li>
          <li className="py-2">
            <NavLink 
              to={`/portal/manage-profile`}
              className={({ isActive, isPending }) =>
              isPending ? "px-6 py-4 flex flex-1 flex-col " : isActive ? "px-6 py-4 flex flex-1 flex-col bg-sky-50" : "px-6 py-4 flex flex-1 flex-col"
            }>
              <label className="hover:cursor-pointer"><AccountCircleIcon className="flex align-text-bottom" fontSize="small" /> Manage Profile</label></NavLink>
          </li>
          <li className="py-2">
            <NavLink 
              to={`/portal/password`}
              className={({ isActive, isPending }) =>
              isPending ? "px-6 py-4 flex flex-1 flex-col " : isActive ? "px-6 py-4 flex flex-1 flex-col bg-sky-50" : "px-6 py-4 flex flex-1 flex-col"
            }>
              <label className="hover:cursor-pointer"><SecurityIcon className="flex align-text-bottom" fontSize="small" /> Password</label></NavLink>
          </li>

          <li className="py-2">
            <NavLink
              to={`/portal/subscription`}
              className={({ isActive, isPending }) =>
              isPending ? "px-6 py-4 flex flex-1 flex-col " : isActive ? "px-6 py-4 flex flex-1 flex-col bg-sky-50" : "px-6 py-4 flex flex-1 flex-col"
            }
            >
              <label className="hover:cursor-pointer"><SubscriptionsIcon className="flex align-text-bottom" fontSize="small" /> Subscription</label></NavLink>
          </li>
          <li className="py-2">
            <NavLink className="px-6 py-4 h-auto flex flex-1 mb-auto" style={{alignContent: 'flex-end'}} to={`/logout`}><label className="hover:cursor-pointer"><LogoutIcon className="flex align-text-bottom" fontSize="small" /> Logout</label></NavLink>
          </li>
        </ol>
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