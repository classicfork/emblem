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
      <div className="px-5 py-5">    
        {data.user ? (
            <Link to={"../"} className="rounded text-white">My Portal</Link>
          ) : (
            <div></div>
          )}
        {data.user ? (
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="rounded text-white"
              >
                Logout
              </button>
          </Form>
          ) : (
            <Link to={"/login?redirectTo=/memorial/" + params.memorialId} className="rounded text-white">Sign In</Link>
          )}
      </div>
      <main>
        <div className="flex justify-center mr-8 ml-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
