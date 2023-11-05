import { type ActionArgs, type LoaderArgs, json, redirect, unstable_composeUploadHandlers, unstable_createFileUploadHandler, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { db } from "~/utils/db.server";

export const loader = async ({ request, params }: LoaderArgs) => {
    const memorial = await db.memorial.findFirst({ where: { publicId: params.memorialId } });

    if (!memorial) {
        throw new Error("Memorial does not exist.");
    }

    return json({ memorial });
}

export const action = async ({ request, params }: ActionArgs) => {
  let imageType;

  // validate better!
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      directory: 'app/images/',
      file: ({ filename }) => {
        imageType = filename.split('.').at(-1);
        return params.memorialId! + '.' + filename.split('.').at(-1)
      },
    }),
    // parse everything else into memory
    unstable_createMemoryUploadHandler()
  );

  console.log(imageType);

  const form = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  const name = form.get("name");
  const obituary = form.get("obituary");
  const mainImage = form.get('mainImage');

  console.log(imageType);

  if (
    typeof obituary !== "string" ||
    typeof name !== "string"
  ) {
    throw new Error("Form not submitted correctly.");
  }

  console.log(imageType);

  const fields = { name, obituary }
  let otherFields = {};

  console.log(imageType);

  if (mainImage!.size !== 0) {
    otherFields = { ...fields,  mainImage: params.memorialId + '.' + mainImage!.filepath.split('.').at(-1) };
  }

  const memorial = await db.memorial.update({
    where: { publicId: params.memorialId },
    data: { ...fields, ...otherFields }
  });

  return redirect('/portal/' + memorial.publicId + '/view');
}

export default function EditMemorialRoute() {
    const data = useLoaderData<typeof loader>();
    console.log(data);

    return (
      <div className="flex justify-center py-5 px-3">
        <div className="flex-col">
          <div className="flex justify-center py-2">
            <p>Create your memorial</p>
          </div>
          
          <Form method="post" encType="multipart/form-data">
            <div className="py-2">
              <label>
                Name: <input  type="text" name="name" defaultValue={data.memorial.name ? data.memorial.name : ""} className="w-full rounded border border-gray-500 px-2 py-1 text-lg"/>
              </label>
            </div>
            <div className="flex py-2">
              <label className="flex justify-center w-64">
                {data.memorial?.mainImage ? 
                  (<img src={`http://localhost:3000/${data.memorial.mainImage}`} alt="Main"/>) : 
                  (<div></div>)
                }
              </label>
            </div>
            <div className="flex">
              <span>Image: <input type="file" id="mainImg" name="mainImage" accept="image/png, image/jpeg" /></span>
            </div>
            <div className="py-2">
              <label>
                Birth Date: <input type="date" name="birthDate" defaultValue={data.memorial.birthDate ? data.memorial.birthDate : ""} />
              </label>
            </div>
            <div className="py-2">
              <label>
                Death Date: <input type="date" name="deathDate" defaultValue={data.memorial.deathDate ? data.memorial.deathDate : ""} />
              </label>
            </div>
            <div className="py-2">
              <label>
                Obituary: <textarea name="obituary" defaultValue={data.memorial.obituary ? data.memorial.obituary : ""} className="w-full rounded border border-gray-500 px-2 py-1 text-lg"/>
              </label>
            </div>
            <div>
              <button type="submit" className="px-3 py-2 text-white rounded-lg bg-sky-500">
                Publish
              </button>
            </div>
          </Form>
        </div>
        
      </div>
    );
  }