// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

import { serverCheckSession } from "./lib/api/serverApi";

const isAuthRoute = (pathname: string) =>
  pathname === "/sign-in" || pathname === "/sign-up";

const isPrivateRoute = (pathname: string) =>
  pathname.startsWith("/profile") || pathname.startsWith("/notes");

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // ✅ 1) Якщо є accessToken — користувач авторизований
  if (accessToken) {
    // авторизований не повинен бути на auth сторінках
    if (isAuthRoute(pathname)) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
    return NextResponse.next();
  }

  // ✅ 2) accessToken нема, але є refreshToken → пробуємо поновити сесію
  if (!accessToken && refreshToken) {
    try {
      const cookieStore = await cookies();
      const sessionRes = await serverCheckSession(cookieStore);

      // пробуємо взяти set-cookie, якщо бекенд оновив токени
      const setCookie = sessionRes.headers?.["set-cookie"];

      // якщо сесія валідна — вважаємо користувача авторизованим
      if (sessionRes.status === 200) {
        if (isAuthRoute(pathname)) {
          const redirect = NextResponse.redirect(new URL("/profile", req.url));

          if (setCookie) {
            if (Array.isArray(setCookie)) {
              setCookie.forEach((c) =>
                redirect.headers.append("set-cookie", c)
              );
            } else {
              redirect.headers.append("set-cookie", setCookie);
            }
          }

          return redirect;
        }

        const next = NextResponse.next();

        if (setCookie) {
          if (Array.isArray(setCookie)) {
            setCookie.forEach((c) => next.headers.append("set-cookie", c));
          } else {
            next.headers.append("set-cookie", setCookie);
          }
        }

        return next;
      }

      // якщо не 200 — поводимось як неавторизований
      if (isPrivateRoute(pathname)) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
      return NextResponse.next();
    } catch {
      // якщо чек сесії впав — теж як неавторизований
      if (isPrivateRoute(pathname)) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
      return NextResponse.next();
    }
  }

  // ✅ 3) Нема ні accessToken, ні refreshToken → неавторизований
  if (isPrivateRoute(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // auth routes і всі інші публічні — дозволяємо
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
