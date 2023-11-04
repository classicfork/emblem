import { type LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await getUser(request);

  if (!user) {
    throw ('No user found.');
  }

  return json({ user });
}

export default function ManageProfileIndexRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="flex-col py-5">
      <div className="py-3">
        <div>
          <p>Name: {data.user.firstName} {data.user.lastName}</p>
        </div>
      </div>
      <div>
        <div>
          <p>Email: {data.user.email}</p>
        </div>
      </div>
    </div>
  );
}