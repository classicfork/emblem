import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { badRequest } from "~/utils/request.server";
import { getUser, getUserId, updateUserNames } from "~/utils/session.server";

function validateName(name: string) {
  if (name.length == 0) {
    return "Name must be filled.";
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
  const userId = await getUserId(request);
  const form = await request.formData();

  const firstName = form.get("first-name");
  const lastName = form.get("last-name");

  if (!userId) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Something went wrong with your account.",
    });
  }

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  const fields = { firstName, lastName };
  const fieldErrors = {
    firstName: validateName(firstName),
    lastName: validateName(lastName),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const user = updateUserNames(userId, firstName, lastName);

  return redirect('../');
}

export default function ManageNameRoute() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  console.log(data);

    return (
        <div>
            <Form method="post">
              <label>
                First name:
                <input
                  type="text"
                  name="first-name"
                  defaultValue={
                    actionData?.fields?.firstName ?
                    actionData?.fields?.firstName :
                    (data.user!.firstName ?
                      data.user!.firstName :
                      "")
                  }
                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  aria-invalid={Boolean(
                    actionData?.fieldErrors?.firstName
                  )}
                  aria-errormessage={
                    actionData?.fieldErrors?.firstName
                      ? "first-name-error"
                      : undefined
                  }/>
              </label>
              {actionData?.fieldErrors?.firstName ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="first-name-error"
                >
                  {actionData.fieldErrors.firstName}
                </p>
              ) : null}
              <label>
                Last name:
                <input
                  type="text"
                  name="last-name"
                  defaultValue={
                    actionData?.fields?.lastName ?
                    actionData?.fields?.lastName :
                    (data.user!.lastName
                      ? data.user!.lastName :
                      "")
                  }
                  className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                  aria-invalid={Boolean(
                    actionData?.fieldErrors?.lastName
                  )}
                  aria-errormessage={
                    actionData?.fieldErrors?.lastName
                      ? "last-name-error"
                      : undefined
                  }/>
              </label>
              {actionData?.fieldErrors?.lastName ? (
                  <p
                    className="form-validation-error"
                    role="alert"
                    id="last-name-error"
                  >
                    {actionData.fieldErrors.lastName}
                  </p>
                ) : null}
              <button type="submit" className="px-3 py-2 my-2 text-slate-700 rounded-lg bg-slate-400">
                  Publish
              </button>
            </Form>
        </div>
    );
}