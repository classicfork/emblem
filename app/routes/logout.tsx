import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import cookie from "cookie";

import { logout } from "~/utils/session.server";

export const action = async ({ request }: ActionArgs) => {
  return json(request, {
    headers: {
      "Set-Cookie": cookie.serialize("RJ_session", "", {
        expires: new Date(0),
      }
    )}
  });
}

export const loader = async () => redirect("/login");