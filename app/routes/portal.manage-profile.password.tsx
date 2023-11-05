import { json, redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { badRequest } from "~/utils/request.server";
import { getUserId, updatePassword } from "~/utils/session.server";

function verifyPasswordStrength(password: string) {
  if (password.length < 6) {
    return "password must be at least 6 characters long";
  }
  if (/\s/g.test(password)) {
    return "no spaces allowed in passwords";
  }
}

function verifyPasswordMatch(password: string, confirmPassword: string) {
  if (password !== confirmPassword) {
    return "passwords don't match";
  }
}

export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await getUserId(request);

  if (!userId) {
    throw ('No user found.');
  }

  return json({ userId });
}

export const action = async ({ request, params }: ActionArgs) => {
  const userId = await getUserId(request);
  const form = await request.formData();

  const password = form.get("password");
  const confirmPassword = form.get("confirm-password");

  if (!userId) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Something went wrong with your portal.",
    });
  }

  if (
    typeof password !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  const fields = { password, confirmPassword };
  const fieldErrors = {
    password: verifyPasswordStrength(password),
    confirmPassword: verifyPasswordMatch(password, confirmPassword),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  try {
    // const user = await updatePassword(userId, password);
    await updatePassword(userId, password);
  } catch (e) {
    console.log(e);
    if (e === "SAME PASSWORD") {
      console.log('hello');
      return badRequest({
        fieldErrors: {
          password: "This equals your current password",
          confirmPassword: null,
        },
        fields: fields,
        formError: null,
      });
    }
    return badRequest({
      fieldErrors: null,
      fields: fields,
      formError: "Something went wrong. Try again later.",
    });
  }

  return redirect('../');
}

export default function ManagePasswordRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <main className="flex justify-start ml-56 mt-10">
      <Form method="post" className="flex-col">
        <div className="py-2">
          <label htmlFor="new-password-input" className=" flex text-sm font-medium text-gray-700">New password</label>
          <input
            type="text"
            name="password"
            className="w-64 p-1 shadow-inner border border-sky-500"
            defaultValue={
              actionData?.fields?.password ?
                actionData?.fields?.password :
                ""
            }
            aria-errormessage={
              actionData?.fieldErrors?.password
                ? "password-error"
                : undefined
            } />
          {actionData?.fieldErrors?.password ? (
            <p
              className="form-validation-error"
              role="alert"
              id="password-error"
            >
              {actionData.fieldErrors.password}
            </p>
          ) : null}
        </div>
        <div className="py-2">
          <label htmlFor="new-password-input" className="flex text-sm font-medium text-gray-700"> Confirm new password</label>
          <input
            type="text"
            name="confirm-password"
            className="w-64 p-1 shadow-inner border border-sky-500"
            defaultValue={
              actionData?.fields?.confirmPassword ?
                actionData?.fields?.confirmPassword :
                ""
            }
            aria-errormessage={
              actionData?.fieldErrors?.confirmPassword
                ? "confirm-password-error"
                : undefined
            }
          />
          {actionData?.fieldErrors?.confirmPassword ? (
            <p
              className="form-validation-error"
              role="alert"
              id="confirm-password-error"
            >
              {actionData.fieldErrors.confirmPassword}
            </p>
          ) : null}
        </div>
        <div className="py-2">
          <button type="submit" className="flex button rounded bg-blue-400 px-4 py-2 text-white hover:bg-blue-500 active:bg-blue-600">
            Submit
          </button>
        </div>
      </Form>
    </main >
  );
}