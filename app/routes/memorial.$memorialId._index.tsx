import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";

import { db } from "~/utils/db.server";

export const loader = async ({ params, request }: LoaderArgs) => {
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

  if (memorial.ownerId) {
    return redirect('obituary');
  }
  return redirect('register');
};