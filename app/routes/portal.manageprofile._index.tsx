import { LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
    const user = await getUser(request);
  
    if (!user) {
      throw('No user found.');
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
              <div className="flex justify-center">
                <Link to="names" className="px-3 py-1 mt-1 text-slate-700 rounded-lg bg-slate-400">
                    Update your name
                </Link>
                </div>
            </div>
            <div>
              <div>
                <p>Email: {data.user.email}</p>
              </div>
              <div className="my-2 flex justify-center">
                <Link to="email" className="px-3 py-1 text-slate-700 rounded-lg bg-slate-400">
                  Change email
                </Link>
              </div>
              <div className="flex justify-center">
                <Link to="password" className="px-3 py-1 text-slate-700 rounded-lg bg-slate-400">
                  Change password
                </Link>
              </div>
            </div>
          </div>
    );
}