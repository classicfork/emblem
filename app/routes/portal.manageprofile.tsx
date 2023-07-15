import { Outlet } from "@remix-run/react";

export default function ManageProfileMemorialRoute() {
    return (
      <div className="flex bg-white justify-center">
        <div className="flex-col">
          <div className="flex-col">
            <h1 className="text-2xl">Manage your profile</h1>
          </div>
          <Outlet/>
        </div>
      </div>
    );
  }