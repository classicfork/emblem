import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { getUser, requireUserId } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  const user = await getUser(request);

  const memorials = await db.memorial.findMany({ where: { ownerId: user?.id } });

  return json({ user, memorials });
}

export default function PortalRoute() {
  const data = useLoaderData<typeof loader>();
  const user = data.user!;
  console.log(data.user);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Portal</Link>
        </h1>
        <p>{user.firstName}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>
      <Outlet/>
    </div>
  )
}