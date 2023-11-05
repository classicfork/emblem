import type {
  ActionArgs,
} from "@remix-run/node";
import {
  Link,
  useActionData,
  useSearchParams,
} from "@remix-run/react";

import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { createUserSession, register } from "~/utils/session.server";

function validateEmail(email: string) {
  const regex = new RegExp('^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6})*$');
  if (!regex.test(email)) {
    return "please provide a valid email"; // TODO: We should go about sending the email and having them validate it.
  }
}

function validateName(name: string) {
  if (name.length == 0) {
    return "Name must be filled.";
  }
}

function validatePassword(password: string) {
  if (password.length < 6) {
    return "Passwords must be at least 6 characters long";
  }
}

function validateUrl(url: string) {
  const urls = [new RegExp("/portal"), new RegExp("/"), new RegExp("https://remix.run"), new RegExp(`^/memorial/(w*)$`)]; // TODO: need to use regex or something
  for (const urlRegex of urls) {
    console.log(urlRegex);
    if (urlRegex.test(url)) {
      console.log('HOORaH');
      return url;
    }
  }

  return "/portal";
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const password = form.get("password");
  const email = form.get("email");
  const firstName = form.get("first-name");
  const lastName = form.get("last-name");

  const redirectTo = validateUrl(
    (form.get("redirectTo") as string) || "/portal"
  );
  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof password !== "string" ||
    typeof email !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  const fields = { firstName, lastName, password, email };

  const fieldErrors = {
    firstName: validateName(firstName),
    lastName: validateName(lastName),
    password: validatePassword(password),
    email: validateEmail(email),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const userExists = await db.user.findFirst({
    where: { email },
  });
  if (userExists) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: `User with email ${email} already exists`,
    });
  }

  const user = await register({ firstName, lastName, email, password });
  if (!user) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError:
        "Something went wrong trying to create a new user.",
    });
  }
  return createUserSession(user.id, redirectTo);
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  return (
    <main className="flex justify-center ">
      <div className="flex flex-col justify-center">
        <div className="flex-col items-center content w-100 h-100 p-10">
          <h1 className="flex justify-center text-3xl font-bold text-gray-600 my-4">Create Account</h1>
          <form method="post">
            <input
              type="hidden"
              name="redirectTo"
              value={
                searchParams.get("redirectTo") ?? undefined
              }
            />
            <div className="mt-3">
              <label htmlFor="first-name-input" className="flex text-sm font-medium text-gray-700">First Name</label>
              <div className="mt-1">
                <input
                  type="text"
                  className="flex rounded border border-gray-500 px-2 py-1 text-lg"
                  id="first-name-input"
                  name="first-name"
                  defaultValue={actionData?.fields?.firstName}
                  aria-invalid={Boolean(
                    actionData?.fieldErrors?.firstName
                  )}
                  aria-errormessage={
                    actionData?.fieldErrors?.firstName
                      ? "first-name-error"
                      : undefined
                  }
                />{actionData?.fieldErrors?.firstName ? (
                  <p
                    className="form-validation-error"
                    role="alert"
                    id="first-name-error"
                  >
                    {actionData.fieldErrors.firstName}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-3">
              <label htmlFor="last-name-input" className="flex text-sm font-medium text-gray-700">Last Name</label>
              <div className="mt-1">
                <input
                  type="text"
                  className="flex rounded border border-gray-500 px-2 py-1 text-lg"
                  id="last-name-input"
                  name="last-name"
                  defaultValue={actionData?.fields?.lastName}
                  aria-invalid={Boolean(
                    actionData?.fieldErrors?.lastName
                  )}
                  aria-errormessage={
                    actionData?.fieldErrors?.lastName
                      ? "last-name-error"
                      : undefined
                  }
                />{actionData?.fieldErrors?.lastName ? (
                  <p
                    className="form-validation-error"
                    role="alert"
                    id="last-name-error"
                  >
                    {actionData.fieldErrors.lastName}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-3">
              <label htmlFor="email-input" className="flex text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input
                  type="text"
                  className="flex rounded border border-gray-500 px-2 py-1 text-lg"
                  id="email-input"
                  name="email"
                  defaultValue={actionData?.fields?.email}
                  aria-invalid={Boolean(
                    actionData?.fieldErrors?.email
                  )}
                  aria-errormessage={
                    actionData?.fieldErrors?.email
                      ? "email-error"
                      : undefined
                  }
                />{actionData?.fieldErrors?.email ? (
                  <p
                    className="form-validation-error"
                    role="alert"
                    id="email-error"
                  >
                    {actionData.fieldErrors.email}
                  </p>
                ) : null}
              </div>

            </div>
            <div className="py-3">
              <label htmlFor="password-input" className="flex text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input
                  id="password-input"
                  className="flex rounded border border-gray-500 px-2 py-1 text-lg"
                  name="password"
                  type="password"
                  defaultValue={actionData?.fields?.password}
                  aria-invalid={Boolean(
                    actionData?.fieldErrors?.password
                  )}
                  aria-errormessage={
                    actionData?.fieldErrors?.password
                      ? "password-error"
                      : undefined
                  }
                />
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
            </div>
            <div id="form-error-message">
              {actionData?.formError ? (
                <p
                  className="form-validation-error"
                  role="alert"
                >
                  {actionData.formError}
                </p>
              ) : null}
            </div>
            <button type="submit" className="mt-2 rounded bg-blue-400 w-full px-6 py-2 text-center text-white hover:bg-blue-500 active:bg-blue-600">
              Submit
            </button>
          </form>
        </div>
        <div className="flex justify-center">
          <span>Already have an account? <Link to={"/login" + (searchParams.get("redirectTo") != null ? "?redirectTo=" + searchParams.get("redirectTo") : "")} className="text-sky-800 underline">Log in here</Link></span>
        </div>
      </div>
    </main>
  );
}
