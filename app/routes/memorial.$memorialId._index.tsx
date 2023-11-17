import { Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  NavLink,
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";

import ImageListComponent from "~/components/imageLists";
import { db } from "~/utils/db.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const memorial = await db.memorial.findFirst({
    where: {
      publicId: params.memorialId,
    }
  });

  const images = await db.memorialImages.findMany({
    where: {
      memorialId: memorial?.publicId
    }
  });

  if (memorial == null) {
    redirect(`/memorial/${params.memorialId}/registery`);
    throw new Response("Memorial not found.", {
      status: 404,
    });
  }

  return json({ images, memorial });
};

export default function MemorialIndex() {
  const data = useLoaderData<typeof loader>();
  const params = useParams();

  return (
    <div>
      <div className="flex justify-center">
        <Card sx={{ maxWidth: 600, marginTop: 5 }}>
          <CardHeader title={data.memorial.name} />
          <CardMedia
            sx={{ height: 250 }}
            image={`/${data.memorial.mainImage}`}
            title={`${data.memorial.name}`}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {data.memorial.birthDate} - {data.memorial.deathDate}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.memorial.description}
            </Typography>
          </CardContent>
          <CardActions>
            {data.memorial.obituary ? (
              <div className="p-2">
                <NavLink to={"/memorial/" + params.memorialId + "/obituary"}>Obituary</NavLink>
              </div>
            ) : null}
            {data.memorial.links ? (
              <div className="p-2">
                <NavLink to={"/memorial/" + params.memorialId + "/links"}>Links</NavLink>
              </div>
            ) : null}
          </CardActions>
        </Card>
      </div>
      <br />
      <ImageListComponent images={data.images} />
    </div>
  );
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