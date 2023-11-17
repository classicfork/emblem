import { Autocomplete, TextField } from "@mui/material";
import type { LoaderArgs } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";

export const loader = async ({ params, request }: LoaderArgs) => {
  const memorials = await db.memorial.findMany({
    where: {
      publicId: params.memorialId
    }
  });

  if (memorials == null) {
    throw new Response("Memorial not found.", {
      status: 404,
    });
  }

  return json({ memorials });
};

export default function MemorialIndexRoute() {
  const { 
    memorials 
  } = useLoaderData<typeof loader>();

  const navigate = useNavigate();

  const onChange = (_: any, memorail: any) => {
    return navigate(`/memorial/${memorail.publicId}`);
  }

  return (
    <div>
      <Autocomplete
        id="combo-box-demo"
        options={memorials}
        onChange={onChange}
        getOptionLabel={(option) => option.name || option.publicId}
        style={{ marginTop: '50%', width: '600px' }}
        renderInput={(params) => (
          <TextField {...params} label="Memorial" variant="outlined" />
        )}
      />
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      I did a whoopsies.
    </div>
  );
}