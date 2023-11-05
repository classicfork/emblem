import { json, type LoaderArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await getUser(request);

  if (!user) {
    throw ('No user found.');
  }

  return json({ user });
}

export default function ManageProfileIndexRoute() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <main className="flex justify-start ml-56 mt-10">
      <Form method="post">
        <div className="flex-inline pr-5 py-3">
          <label>
          <div className="flex text-sm font-medium text-gray-700">First Name</div>
            {user.firstName}
          </label>
        </div>
        <div className="flex-inline pr-5 py-3">
          <label>
          <div className="flex text-sm font-medium text-gray-700">Last Name</div>
            {user.lastName}
          </label>
        </div>
        <div className="flex-inline pr-5 py-3">
        <div className="flex text-sm font-medium text-gray-700">Email</div>
          <label>
            {user.email}
          </label>
        </div>
        <div className="flex justify-between py-2">
          <Link to={`/portal/manage-profile/edit`}>
            <button type="button" className="flex button rounded bg-blue-400 px-6 py-2 text-white hover:bg-blue-500 active:bg-blue-600">
              Edit
            </button>
          </Link>
        </div>
      </Form>
    </main>
  );
}