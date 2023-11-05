import { Outlet } from "@remix-run/react";

export default function ManageProfileMemorialRoute() {
  return (
    <div className="flex bg-white justify-start">
      <Outlet />
    </div>
  );
}