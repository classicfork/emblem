import {
    createCookieSessionStorage,
    redirect,
  } from "@remix-run/node";

import bcrypt from "bcryptjs";

import { db } from "./db.server";

type RegisterForm = {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

type LoginForm = {
  password: string;
  email: string;
};

export async function login({
  password,
  email,
}: LoginForm) {
  const user = await db.user.findUnique({
    where: { email },
  });
  if (!user) {
    return null;
  }

  const isCorrectPassword = await bcrypt.compare(
    password,
    user.passwordHash
  );
  if (!isCorrectPassword) {
    return null;
  }

  return { id: user.id, email };
}

export async function register({ firstName, lastName, password, email }: RegisterForm) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { firstName, lastName, passwordHash, email },
  });
  return { id: user.id, email };
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return null;
  }
  return userId;
}

export async function requireUserId(
    request: Request,
    redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo],
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }
  
  try {
    const user = await db.user.findUnique({
      select: { id: true, email: true, firstName: true, lastName: true, memorials: true },
      where: { id: userId },
    });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function updateUserEmail(userId: string, newEmail: string) {
  const findUser = await db.user.findFirst(
    {
      select: {
        email: true
      }
    });
  if (findUser) {
    throw "EXISTING EMAIL"
  }

  try {
    const user = await db.user.update({
      where: {
        id: userId
      },
      data: {
        email: newEmail
      }
    });
    return user;
  } catch (e) {
    console.log(e);
    throw "something went wrong";
  }
}

export async function updateUserNames(userId: string, firstName: string, lastName: string) {
  try {
    const user = await db.user.update({
      where: {
        id: userId
      },
      data: {
        firstName,
        lastName
      }
    });
    return user;
  } catch (e) {
    console.log(e);
    throw "something went wrong";
  }
}

export async function updateUserData(userId: string, firstName: string, lastName: string, email: string) {
  try {
    const user = await db.user.update({
      where: {
        id: userId
      },
      data: {
        firstName,
        lastName,
        email
      }
    });
    return user;
  } catch (e) {
    console.log(e);
    throw "something went wrong";
  }
}

export async function updatePassword(userId: string, newPassword: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw "something went wrong";
  }

  const matchesPassword = await bcrypt.compare(
    newPassword,
    user?.passwordHash
  );

  if (matchesPassword) {
    throw "SAME PASSWORD";
  }
  
  try {
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const user = await db.user.update({
      where: {
        id: userId
      },
      data: {
        passwordHash: newPasswordHash
      }
    });
    return user;
  } catch (e) {
    console.log(e);
    throw "something went wrong. please try again laster.";
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  debugger;
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(
    userId: string,
    redirectTo: string
  ) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
