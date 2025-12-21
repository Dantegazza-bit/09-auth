"use client";

import { useEffect } from "react";
import type { User } from "@/types/user";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  initialUser: User | null;
};

export default function AuthInit({ initialUser }: Props) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    } else {
      clearIsAuthenticated();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUser]);

  return null;
}
