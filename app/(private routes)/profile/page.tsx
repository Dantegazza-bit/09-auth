import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Image from "next/image";
import type { Metadata } from "next";

import { serverCheckSession, serverGetMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "User profile page",
};

export default async function ProfilePage() {
  const cookieStore = await cookies();

  const isAuth = await serverCheckSession(cookieStore);
  if (!isAuth) redirect("/sign-in");

  const user = await serverGetMe(cookieStore);
  if (!user) redirect("/sign-in");

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <a href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src="/default-avatar.png"
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
