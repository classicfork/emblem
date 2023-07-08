import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/session.server";
// import { getImage } from "~/utils/photos.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await getUserId(request);
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

  // console.log(getImage(params.memorialId!));

  // require(params.memorialId!);

  return json({ memorial, userId });
};

export default function MemorialPortalRoute() {
  const data = useLoaderData<typeof loader>();
  const params = useParams();
  //const image = data.memorial?.mainImage ? require(data.memorial.mainImage) : "";

  return (
    <div>
      <div className="flex justify-center">
        <div>
          { data.memorial.obituary ? (
            <div className="flex-col items-center max-w-md px-3">
              <div className="py-3 flex justify-center">
                {data.memorial?.mainImage ? 
                  (<img src={`/public/${data.memorial.mainImage!}`} alt="Main"/>) : 
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
              <div className="text-justify whitespace-pre-line">
                <p>
                  {data.memorial?.obituary}
                </p>
              </div>
            </div>
          ) : (
              <div className="m-2 flex justify-center">
                  <p className="text-center">We're excited for you to create your memorial for {data.memorial?.name}.</p>
              </div>
          )}
          <div className="flex justify-center py-7">
            <Link to={"/portal/" + params.memorialId + "/edit"} className="px-3 py-2 text-slate-700 rounded-lg bg-slate-400">{data.memorial.obituary ? "Edit" : "Create"}</Link>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}