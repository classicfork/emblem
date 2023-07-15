import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { badRequest } from "~/utils/request.server";
import { getUser, getUserId, updateUserEmail } from "~/utils/session.server";

function validateEmail(email: string, oldEmail: string) {
  const regex = new RegExp('^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6})*$');

  if (email === oldEmail) {
    return "this is the same email you already have";
  }
  
  if (!regex.test(email)) {
    return "please provide a valid email"; // TODO: We should go about sending the email and having them validate it.
  }
}

export const loader = async ({ request, params }: LoaderArgs) => {
  const user = await getUser(request);

  if (!user) {
    throw('No user found.');
  }

  return json({ user });
}

export const action = async ({ request, params }: ActionArgs) => {
  const form = await request.formData();
  const email = form.get('email');

  // probably not idea. better to do getUser instead?
  const oldEmail = form.get('oldEmail');
  const userId = await getUserId(request);

  if (oldEmail == null || typeof oldEmail !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Something went wrong with fetching your current email.",
    });
  }

  if (
    typeof email !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  const fields = { email };
  const fieldErrors = {
    email: validateEmail(email, oldEmail),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  try {
    if (typeof userId === "string") {
      const user = await updateUserEmail(userId, email);
    } else {
      return badRequest({
        fieldErrors: null,
        fields: null,
        formError: "Something went wrong",
      });
    }
  } catch (e) {
    if (e === "EXISTING EMAIL") {
      return badRequest({
        fieldErrors: {
          email: "This email is already used by another account",
        },
        fields,
        formError: null,
      });
    }
  }

  return redirect('../');
}

export default function ManageEmailRoute() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  console.log(data);

    return (
      <div>
          <Form method="post">
            <input
              type="hidden"
              name="oldEmail"
              value={
                data.user.email ?? undefined
              }
            />
            <label>
              Email:
              <input
                type="text"
                name="email"
                defaultValue={
                  actionData?.fields?.email ?
                  actionData?.fields?.email :
                  (data.user!.email ? data.user!.email : "")
                }
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                aria-errormessage={
                  actionData?.fieldErrors?.email
                    ? "email-error"
                    : undefined
                }/>
            </label>
            {actionData?.fieldErrors?.email ? (
                        <p
                          className="form-validation-error"
                          role="alert"
                          id="email-error"
                        >
                          {actionData.fieldErrors.email}
                        </p>
                      ) : null}
            <button type="submit" className="px-3 py-2 my-2 text-slate-700 rounded-lg bg-slate-400">
                Publish
            </button>
          </Form>
      </div>
    );
}