"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

import { updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [username, setUsername] = useState(user?.username ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      const updatedUser = await updateMe({ username });

      // оновлюємо store, щоб Header/Profile одразу показали нові дані
      setUser(updatedUser);

      router.push("/profile");
    } catch {
      setError("Failed to update profile. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <main className={css.mainContent}>
      <div className={css.card}>
        <h1 className={css.title}>Edit Profile</h1>

        {/* ✅ Аватар через next/image */}
        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
          priority
        />

        <form onSubmit={handleSubmit} className={css.form}>
          <label className={css.label}>
            Username
            <input
              className={css.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={2}
              required
            />
          </label>

          {/* ✅ Email тільки для читання */}
          <p className={css.email}>Email: {user.email}</p>

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button
              type="button"
              className={css.secondaryBtn}
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={css.primaryBtn}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
