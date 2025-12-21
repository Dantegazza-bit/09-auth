import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { serverCheckSession } from "@/lib/api/serverApi";

export default async function PrivateLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAuth = await serverCheckSession(cookieStore);

  if (!isAuth) {
    redirect("/sign-in");
  }

  return (
    <>
      {children}
      {modal}
    </>
  );
}
