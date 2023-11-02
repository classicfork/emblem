import type {
    ActionArgs,
  } from "@remix-run/node";
  import {
    Link,
    useActionData,
    useSearchParams,
  } from "@remix-run/react";

  import { badRequest } from "~/utils/request.server";
  import { createUserSession, login } from "~/utils/session.server";

function validateEmail(email: string) {
  const regex = new RegExp('^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6})*$');
  console.log(email);
  console.log(regex.test(email));
  if (!regex.test(email)) {
    return "please provide a valid email"; // TODO: We should go about sending the email and having them validate it.
  }
}

function validatePassword(password: string) {
  if (password.length < 6) {
    return "Passwords must be at least 6 characters long";
  }
}

function validateUrl(url: string) {
  const urls = [new RegExp("/portal"), new RegExp("/"), new RegExp("https://remix.run"), new RegExp(`^/memorial/(w*)$`)]; // TODO: need to use regex or something
  for (let urlRegex of urls) {
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
  const redirectTo = validateUrl(
    (form.get("redirectTo") as string) || "/portal"
  );
  if (
    typeof password !== "string" ||
    typeof email !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  const fields = { password, email };
  const fieldErrors = {
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

  const user = await login({ email, password });
  console.log({ user });
  if (!user) {
      return badRequest({
        fieldErrors: null,
        fields,
        formError:
          "Email/Password combination is incorrect",
    });
  }
  return createUserSession(user.id, redirectTo);
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  return (
    <div>
      <header className="flex items-center justify-center bg-slate-200 p-4 text-white">
        <Link to="/" className="text-3xl font-luminari font-bold text-gray-600">Memorial</Link>
        <div></div>
        <div></div>
      </header>
      <main>
        <div className="flex justify-center min-h-full">
          <div className="flex-col w-100 h-100 p-10">
            <div className="m-10" data-light="">
              <h3 className="text-lg text-center font-bold text-gray-600 my-4">Sign In</h3>
              <form method="post">
                <input
                  type="hidden"
                  name="redirectTo"
                  value={
                    searchParams.get("redirectTo") ?? undefined
                  }
                />
                <div>
                  <label htmlFor="email-input" className="text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="rounded border border-gray-500 px-2 py-1 text-lg"
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
                  <label htmlFor="password-input" className="text-sm font-medium text-gray-700">Password</label>
                  <div className="mt-1">
                    <input
                      id="password-input"
                      className="rounded border border-gray-500 px-2 py-1 text-lg"
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
                <button type="submit" className="button rounded w-full bg-blue-400 px-4 py-2 text-white hover:bg-blue-500 active:bg-blue-600">
                  Submit
                </button>
              </form>
            </div>
            <div className="flex justify-center">
              <span>Need an account? <Link to={"/createaccount" + (searchParams.get("redirectTo") != null ? "?redirectTo=" + searchParams.get("redirectTo") : "")} className="text-sky-800 underline">Sign up</Link></span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
