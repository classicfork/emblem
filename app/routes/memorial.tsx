import { Form, Link, Outlet, useLoaderData, useParams } from "@remix-run/react";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";

import { json } from "@remix-run/node";
import { getUser } from "~/utils/session.server";

import stylesUrl from "~/styles/memorial.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  return json({ user });
}

export default function MemorialRoute() {
  const data = useLoaderData<typeof loader>();
  const params = useParams();
  console.log(params);

  return (
    <div>
      <header className="flex items-center justify-between bg-slate-200 p-4 text-white">
        <h1 className="text-3xl font-bold text-gray-600">Emblem</h1>
        {data.user ? (
            <Link to={"../portal"} className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600">My Portal</Link>
          ) : (
            <div></div>
          )}
        {data.user ? (
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
              >
                Logout
              </button>
          </Form>
          ) : (
            <Link to={"/login?redirectTo=/memorial/" + params.memorialId} className="rounded bg-slate-400 px-4 py-2 text-blue-800 hover:bg-blue-500 active:bg-blue-600">Login/Create Account</Link>
          )}
      </header>
      <main>
        <div className="flex justify-center">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
