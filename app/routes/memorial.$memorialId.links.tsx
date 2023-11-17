// import { json, redirect } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";
// import type { LoaderArgs } from "@remix-run/node";

// import { db } from "~/utils/db.server";
// import { getUser } from "~/utils/session.server";

// export const loader = async ({ params, request }: LoaderArgs) => {
//   return redirect(`/memorial/${params.memorialId}`)
    // const user = await getUser(request);
    // const memorial = await db.memorial.findFirst({
    //   where: {
    //     publicId: params.memorialId
    //   }
    // });
  
    // if (memorial == null) {
    //   throw new Response("Memorial not found.", {
    //     status: 404,
    //   });
    // }
  
    // console.log(memorial);
  
    // return json({ memorial, user });
  // };

// export default function MemorialLinkRoute() {
//     const data = useLoaderData<typeof loader>();
//     if (data.memorial.links) {
//         console.log(JSON.parse(data.memorial.links));
//     }
//     console.log(data.user);

//     return (
//       <div className="flex justify-center">
//         <div className="flex-col items-center max-w-md px-3">
//           <div className="py-3 flex justify-center">
//             {data.memorial?.mainImage ? 
//               (<img src={`${data.memorial.mainImage!}`} alt="Main"/>) : 
//               (<div></div>)
//             }
//           </div>
//           <div className="flex justify-center">
//             <h3 className="text-2xl font-bold">
//               {data.memorial?.name}
//             </h3>
//           </div>
//           <div className="flex justify-around py-4">
//             <p className="text-xl">1935</p>
//             <p>-</p>
//             <p className="text-xl">2017</p>
//           </div>
//           <div className="text-justify whitespace-pre-line">
//             <p>
//               links links
//               links links
//               links links
//             </p>
//           </div>
//         </div>
//       </div>
//     );
// }