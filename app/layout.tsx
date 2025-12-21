import type { Metadata } from "next";
import { cookies } from "next/headers";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import AuthInit from "@/components/AuthInit/AuthInit";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

import { serverCheckSession, serverGetMe } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "NoteHub",
  description: "NoteHub is an app for creating and managing personal notes.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const isAuth = await serverCheckSession(cookieStore);
  const initialUser = isAuth ? await serverGetMe(cookieStore) : null;

  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <AuthInit initialUser={initialUser} />
          <Header />
          {children}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
