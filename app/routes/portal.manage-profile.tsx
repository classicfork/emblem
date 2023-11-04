import { NavLink, Outlet } from "@remix-run/react";

export default function ManageProfileMemorialRoute() {
  return (
    <main className="flex justify-start h-screen">
      <nav className="flex flex-col border-r-2 shadow-r-md">
        <ul>
        <li className="px-6 py-4">
            <NavLink className="flex flex-1 flex-col" to={`/edit`}>Personal Information</NavLink>
          </li>
          <li className="px-6 py-4">
            <NavLink className="flex flex-1 flex-col" to={`/portal/home`}>Memorials</NavLink>
          </li>
          <li className="px-6 py-4">
            <NavLink
              to={`/password`}
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
    </main>
  );
}