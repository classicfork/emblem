import { json } from "@remix-run/node";
import { 
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
  Outlet,
  NavLink, } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";

import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const user = await getUser(request);
  const memorial = await db.memorial.findFirst({
    where: {
      publicId: params.memorialId
    }
  });

  if (memorial == null) {
    throw new Response("Memorial not found.", {
      status: 404,
    });
  }

  console.log(memorial);

  return json({ memorial, user });
};

export default function MemorialRoute() {
  const data = useLoaderData<typeof loader>();
  const params = useParams();

  return (
    <div className="flex justify-center">
      <Outlet/>
      { data.memorial.obituary && data.memorial.links ? (
        <div className="absolute bottom-3">
          <div className="divide-x flex justify-center">
            <NavLink to={"/memorial/" + params.memorialId + "/obituary"} className={({ isActive }) => "px-4 py-1 text-blue-100 hover:bg-blue-500 active:bg-blue-600" + (isActive ? " bg-slate-900" : " bg-slate-500")}>
              Obituary
            </NavLink>
            <NavLink to={"/memorial/" + params.memorialId + "/links"} className={({ isActive }) => "px-4 py-1 text-blue-100 hover:bg-blue-500 active:bg-blue-600" + (isActive ? " bg-slate-900" : " bg-slate-500")}>
              Links
            </NavLink>
          </div>
        </div>
      ) : (
        <div></div>
      ) }
    </div>
    
  );
}

export function ErrorBoundary() {
  const { memorialId } = useParams();

  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="error-container">
        Huh? What the heck is "{memorialId}"?
      </div>
    );
  }

  return (
    <div className="error-container">
      There was an error loading memorial by the id "${memorialId}".
      Sorry.
    </div>
  );
}