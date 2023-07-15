import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
    const user = await getUserId(request);
    const memorials = await db.memorial.findMany({ where: { ownerId: user } });
  
    return json({ memorials });
  }

export default function MemorialsPortal() {
  const data = useLoaderData<typeof loader>();

    return (
      <div className="flex bg-white justify-center">
          <div className="flex-col">
              <div className="flex justify-center py-5">
                  <h1 className="text-3xl">Your Memorials</h1>
              </div>
              <div className="">
              {data.memorials.length === 0 ? (
                  <p className="p-4">No memorials yet</p>
              ) : (
                  <ol>
                  {data.memorials.map((memorial) => (
                      <li key={memorial.id}>
                        <Link
                            className="block border p-4 text-xl truncate bg-slate-50 my-3"
                            to={'../' + memorial.publicId}
                        >
                          <div className="flex justify-between">
                            <p>{memorial.name}</p>
                            {!memorial.obituary ? (<span>(!)</span>) : (<span></span>)}
                          </div>
                        </Link>
                      </li>
                  ))}
                  </ol>
              )}
              </div>
          </div>
        </div>
    );
}