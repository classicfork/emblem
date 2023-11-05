import { json, redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { badRequest } from "~/utils/request.server";
import { getUser, getUserId, updateUserData } from "~/utils/session.server";

function validateName(name: string) {
  if (name.length == 0) {
    return "Name must be filled.";
  }
}

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
  invariant(params, "Missing publicId param");
  const user = await getUser(request);
  if (!user) {
    throw ('No user found.');
  }
  return json({ user });
}

export const action = async ({ request, params }: ActionArgs) => {
  const userId = await getUserId(request);
  const form = await request.formData();

  const firstName = form.get("first-name");
  const lastName = form.get("last-name");
  const email = form.get('email');

  // probably not idea. better to do getUser instead?
  const oldEmail = form.get('oldEmail');

  if (!userId) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Something went wrong with your portal.",
    });
  }

  if (oldEmail == null || typeof oldEmail !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Something went wrong with fetching your current email.",
    });
  }

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof email !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  const fields = { firstName, lastName, email };
  const fieldErrors = {
    firstName: validateName(firstName),
    lastName: validateName(lastName),
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
      // const user = updateUserNames(userId, firstName, lastName, email);
      await updateUserData(userId, firstName, lastName, email);
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
          email: "This email is already used by another portal",
        },
        fields,
        formError: null,
      });
    }
  }
  return redirect('../');
}

export default function ManageNameRoute() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <main className="flex justify-start ml-56 mt-10">
      <Form method="post">
        <div className="flex-inline pr-5 py-3">
          <label>
          <div className="flex text-sm font-medium text-gray-700">First Name</div>
            <input
              type="text"
              name="first-name"
              defaultValue={
                actionData?.fields?.firstName ?
                  actionData?.fields?.firstName :
                  (user!.firstName ?
                    user!.firstName :
                    "")
              }
              className="w-64 p-1 shadow-inner border border-sky-500"
              aria-invalid={Boolean(
                actionData?.fieldErrors?.firstName
              )}
              aria-errormessage={
                actionData?.fieldErrors?.firstName
                  ? "first-name-error"
                  : undefined
              } />
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
        </div>
        <div className="flex-inline pr-5 py-3">
          <label>
          <div className="flex text-sm font-medium text-gray-700">Last Name</div>
            <input
              type="text"
              name="last-name"
              defaultValue={
                actionData?.fields?.lastName ?
                  actionData?.fields?.lastName :
                  (user!.lastName
                    ? user!.lastName :
                    "")
              }
              className="w-64 p-1 shadow-inner border border-sky-500"
              aria-invalid={Boolean(
                actionData?.fieldErrors?.lastName
              )}
              aria-errormessage={
                actionData?.fieldErrors?.lastName
                  ? "last-name-error"
                  : undefined
              } />
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
        </div>
        <div className="flex-inline pr-5 py-3">
          <input
            type="hidden"
            name="oldEmail"
            value={
              user.email ?? undefined
            }
          />
          <div className="flex text-sm font-medium text-gray-700">Email</div>
          <label>
            <input
              type="text"
              name="email"
              defaultValue={
                actionData?.fields?.email ?
                  actionData?.fields?.email :
                  (user!.email ? user!.email : "")
              }
              className="w-64 p-1 shadow-inner border border-sky-500"
              placeholder="Email"
              aria-errormessage={
                actionData?.fieldErrors?.email
                  ? "email-error"
                  : undefined
              } />
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
        </div>
        <div className="flex justify-between py-2">
          <button type="submit" className="flex button rounded bg-blue-400 px-6 py-2 text-white hover:bg-blue-500 active:bg-blue-600">Submit</button>
          <Link to={"/portal/manage-profile"}>
            <button type="button" className="flex button rounded bg-blue-400 px-6 py-2 text-white hover:bg-blue-500 active:bg-blue-600">
              Cancel
            </button>
          </Link>
        </div>
      </Form>
    </main >
  );
}