import { Outlet } from "@remix-run/react";

export default function MemorialRoute() {
  return (
      <main>
        <div className="flex justify-center mr-8 ml-8">
          <Outlet />
        </div>
      </main>
  );
}