import { Link, useLocation } from "@remix-run/react";
import { NavLink, Outlet, useParams } from "@remix-run/react";

export default function MemorialPortalRoute() {
    const params = useParams();
    const location = useLocation().pathname.split('/').at(-1);
    console.log(location === 'view');

    return (
        <div>
            <div className="flex justify-center space-x-4">
                <NavLink
                    to={"/portal/" + params.memorialId + "/view"}
                    className={(location === 'view' || location === 'edit' ?
                                "bg-slate-300 " :
                                "hover:bg-slate-100 hover:text-slate-900 ") +
                                "font- px-3 py-2 text-slate-700 rounded-lg"}>
                    Obituary
                </NavLink>
                <NavLink
                    to={"/portal/" + params.memorialId + "/links"}
                    className={(location === 'links' ?
                                "bg-slate-300 " :
                                "hover:bg-slate-100 hover:text-slate-900 ") +
                                "font- px-3 py-2 text-slate-700 rounded-lg"}>
                    Links
                </NavLink>
                <NavLink
                    to={"/portal/" + params.memorialId + "/manage"}
                    className={(location === 'manage' ?
                                "bg-slate-300 " :
                                "hover:bg-slate-100 hover:text-slate-900 ") +
                                "font- px-3 py-2 text-slate-700 rounded-lg"}>
                    Manage
                </NavLink>
            </div>
            <Outlet />
        </div>
    )
}