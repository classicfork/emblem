import { ActionArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { 
  isRouteErrorResponse,
  Form,
  useLoaderData,
  useParams,
  useRouteError, } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";

import { db } from "~/utils/db.server";
import { getUser, getUserId } from "~/utils/session.server";

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

  if (memorial.obituary) {
    return redirect('../obituary');
  }

  console.log(memorial);

  return json({ memorial, user });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const publicId = formData.get('publicId')?.toString();
  const name = formData.get('firstNames')?.toString() + " " + formData.get('lastNames')?.toString();
  const userId = await getUserId(request);

  const memorial = await db.memorial.update({
    where: { publicId: publicId },
    data: { ownerId: userId, name }
  });

  return redirect('/memorial/' + memorial.publicId);
}

export default function MemorialRoute() {
  const data = useLoaderData<typeof loader>();
  console.log(data.user);

  if (data.user) {
    return (
      <div className="m-2">
        <p>This is a valid memorial link, but it has not been registered or published yet.</p>
        <p>Please register this memorial.</p>
        <Form method="post">
          <input name="publicId" type="hidden" value={data.memorial.publicId}></input>
          <label>
            First name(s): <input name="firstNames" type="text" className="w-full rounded border border-gray-500 px-2 py-1 text-lg"></input>
          </label>
          <br/>
          <label>
            Last name(s): <input name="lastNames" type="text" className="w-full rounded border border-gray-500 px-2 py-1 text-lg"></input>
          </label>
          <br/>
          <label>
            Verification code: <input name="qrVerificationCode" type="text" className="w-full rounded border border-gray-500 px-2 py-1 text-lg"></input>
          </label>
          <br/>
          <div className="flex justify-center">
            <button type="submit" className="px-3 py-2 text-slate-700 rounded-lg bg-slate-400 my-2">Register</button>
          </div>
          
        </Form>
      </div>
    );
  }

  return (
    <div>
      <p>This is a valid memorial link, but it has not been registered or published yet.</p>
      <p>Please log in first to register this memorial.</p>
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