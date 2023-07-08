import type { LoaderArgs, ActionArgs } from "@remix-run/node";
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

    return json({ links: {}})
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
            <div>
              <label>
                FamilySeach: <input type="text" name="name" defaultValue={data.links.familySearch ? data.links.familySearch : ""} />
              </label>
            </div>
            <div>
              <label>
                Public obituary: <input type="text" name="obituary" defaultValue={data.links.publicObituary ? data.links.publicObituary : ""} />
              </label>
            </div>
            <div>
              <button type="submit" className="px-3 py-2 text-slate-700 rounded-lg bg-slate-400">
                Save links
              </button>
            </div>
          </Form>
        </div>
      </div>
    );
  }