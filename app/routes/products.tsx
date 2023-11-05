import { Box, Typography, Button } from "@mui/material";
import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const pricing = await db.pricing.findMany();

  if (pricing == null) {
    throw new Response("Memorial not found.", {
      status: 404,
    });
  }
    
  return json({ pricing });
};

export default function ProductsRoute() {
  const { pricing } = useLoaderData<typeof loader>();
  return (
    <div className="content text-center">
      <Box className="inline-flex ">
      {pricing && pricing.map((product: any) => (
        <Box key={product.publicId} className="shadow-xl my-20 mr-0 ml-20">
          <Box width={375} height={350} marginBottom={5} style={{ background: 'url(vine-background-small.png)', backgroundSize: '100%' }}>
            <img src={'emblem-bronze.png'} alt="Emblem-Logo" style={{ transform: 'scale(0.2)' }} />
            <Box display={'inline-flex'} >
              <Typography color={"rgb(0, 127, 255)"} variant={"h3"} fontWeight={700} letterSpacing={0.2} fontSize={'2.25rem'} marginTop={1} lineHeight={1.2}>{product.price}</Typography>
              <Typography variant={"body2"} paragraph={true} fontWeight={400} letterSpacing={0} fontSize={'0.875rem'} lineHeight={1.5} marginTop={2.5} marginLeft={0.5}>month</Typography>
            </Box>
          </Box>
          <Box padding={3}>
            <Button variant="contained" style={{ backgroundColor: 'rgb(49, 151, 254)', width: '60%' }}>Buy now</Button>
            <Box marginTop={2}>
              <Typography variant={"h6"} fontWeight={700}>{`${product.name} Tier`}</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>{product.photo}</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>{product.obituary}</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>{product.links}</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>{product.stories}</Typography>
              <Typography className="py-1" variant={"body1"} fontWeight={500}>{product.visits}</Typography>
            </Box>
          </Box>
        </Box>
      )
      )}
      </Box>
    </div>
  )
}
