import { useLocation, NavLink, Outlet, useParams } from "@remix-run/react";

export default function MemorialPortalRoute() {
  const params = useParams();
  const location = useLocation().pathname.split('/').at(-1);
  console.log(location === 'view');

  return (
    <div>
      <div className="flex justify-center space-x-8 mt-20">
        <NavLink
          to={"/portal/" + params.memorialId + "/view"}
          className={
            (location === 'view' || location === 'edit' ?
              "text-center border-b-2 border-sky-300" : "") + "font- px-3 py-2 border-sky-300"
        }>
          Obituary
        </NavLink>
        <NavLink
          to={"/portal/" + params.memorialId + "/links"}
          className={(location === 'links' ?
          "text-center border-b-2 border-sky-300" : "") + "font- px-3 py-2 border-sky-300"
        }>
          Links
        </NavLink>
        <NavLink
          to={"/portal/" + params.memorialId + "/manage"}
          className={(location === 'manage' ?
          "text-center border-b-2 border-sky-300" : "") + "font- px-3 py-2 border-sky-300"
        }>
          Manage
        </NavLink>
      </div>
      <Outlet />
    </div>
  )
}