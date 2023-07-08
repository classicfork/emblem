import { json, redirect } from "@remix-run/node";
import { 
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError, } from "@remix-run/react";
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

  if (!memorial.obituary && user?.id == memorial.ownerId) {
    return redirect('/portal');
  }

  console.log(memorial);

  return json({ memorial, user });
};

export default function MemorialRoute() {
  const data = useLoaderData<typeof loader>();
  console.log(data.user);
  console.log(data.memorial.mainImage);

  if (data.memorial.obituary) {
    return (
      <div className="flex justify-center">
        <div className="flex-col items-center max-w-md px-3">
          <div className="py-3 flex justify-center">
            {data.memorial?.mainImage ? 
              (<img src={`${data.memorial.mainImage!}`} alt="Main"/>) : 
              (<div></div>)
            }
          </div>
          <div className="flex justify-center">
            <h3 className="text-2xl font-bold">
              {data.memorial?.name}
            </h3>
          </div>
          <div className="flex justify-around py-4">
            <p className="text-xl">1935</p>
            <p>-</p>
            <p className="text-xl">2017</p>
          </div>
          <div className="text-justify  whitespace-pre-line">
            <p>
              {data.memorial?.obituary}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p>This is a valid memorial link that has been registered for {data.memorial.name}, but it has not been published yet.</p>
      <p>If you are the owner, please log in, and then you can create it in the portal.</p>
    </div>
  )
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