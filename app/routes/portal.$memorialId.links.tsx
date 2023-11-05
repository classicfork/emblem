import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";


export const loader = async ({ request, params }: LoaderArgs) => {
  const memorial = await db.memorial.findFirst({ where: { publicId: params.memorialId } });

  if (!memorial) {
    throw new Error("Memorial does not exist.");
  }

  if (memorial.links) {
    return json({ links: JSON.parse(memorial.links!) });
  }

  return json({ links: {} })
}

export const action = async ({ request, params }: ActionArgs) => {
  const form = await request.formData();
  // const name = form.get("name");
  // const obituary = form.get("obituary");

  if (
    false // link validation
  ) {
    throw new Error("Form not submitted correctly.");
  }

  // const fields = { name, obituary };
  // const memorial = await db.memorial.update({
  //   where: { publicId: params.memorialId },
  //   data: fields
  // });

  return redirect('/portal/memorials/' + params.memorialId);//' + memorial.publicId + '/view');
}

export default function EditMemorialRoute() {
  const data = useLoaderData<typeof loader>();
  console.log(data);

  return (
    <div className="flex justify-center py-5">
      <div className="flex-col">
        <div className="flex justify-center py-2">
          <p>Enter links</p>
        </div>
        <Form method="post">
          <div className="py-4">
            <label className="flex text-sm font-medium text-gray-700">
              FamilySeach
            </label>
            <input className="w-64 p-1 shadow-inner border border-sky-500"
              type="text" name="name" defaultValue={data.links.familySearch ? data.links.familySearch : ""} />
          </div>
          <div className="py-4">
            <label className="flex text-sm font-medium text-gray-700">
              Public Obituary
            </label>
            <input className="w-64 p-1 shadow-inner border border-sky-500"
              type="text" name="obituary" defaultValue={data.links.publicObituary ? data.links.publicObituary : ""} />
          </div>
          <div className="py-4">
            <button type="submit" className="px-3 py-2 text-white rounded-lg bg-sky-500">
              Save links
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}