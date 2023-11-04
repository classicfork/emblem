import { Avatar, Chip } from "@mui/material";
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
    <main className="flex justify-center">
      <div className="flex-col">
        <h1 className="text-3xl pt-16 pb-4">Your Memorials</h1>
          {data.memorials.length === 0 ? (
            <p className="p-4">No memorials yet</p>
          ) : (
            <ol>
              {data.memorials.map((memorial) => (
                <div className="flex justify-center py-4" key={memorial.id}>
                  <Link
                    to={'../' + memorial.publicId}
                  >
                    <Chip className="flex scale-150"
                      avatar={<Avatar alt="Natacha" src={`http://localhost:3000/${memorial.mainImage}`} />}
                      label={memorial.name}
                      variant="outlined"
                    />
                  </Link>
                </div>
              ))}
            </ol>
          )}
        </div>
    </main>
  );
}