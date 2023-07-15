import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
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
    throw('No user found.');
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
      formError: "Something went wrong with your account.",
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
    const user = await updatePassword(userId, password);
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
      <div>
          <Form method="post">
            <label>
              New password:
              <input
                type="text"
                name="password"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                defaultValue={
                  actionData?.fields?.password ?
                  actionData?.fields?.password :
                  ""
                }
                aria-errormessage={
                  actionData?.fieldErrors?.password
                    ? "password-error"
                    : undefined
                }/>
            </label>
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
            <label>
              Confirm new password:
              <input
                type="text"
                name="confirm-password"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
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
            </label>
            {actionData?.fieldErrors?.confirmPassword ? (
              <p
                className="form-validation-error"
                role="alert"
                id="confirm-password-error"
              >
                {actionData.fieldErrors.confirmPassword}
              </p>
            ) : null}
            <button type="submit" className="px-3 py-2 my-2 text-slate-700 rounded-lg bg-slate-400">
                Submit
            </button>
          </Form>
      </div>
  );
}