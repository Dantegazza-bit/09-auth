"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession } from "@/lib/api/clientApi";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const user = await checkSession(); // Перевірка сесії

      if (user) {
        setUser(user); // Якщо є користувач, зберігаємо його
      } else {
        clearIsAuthenticated();
        if (window.location.pathname.startsWith("/profile")) {
          router.push("/sign-in"); // Якщо не авторизований, перенаправляємо на /sign-in
        }
      }
    };

    getSession();
  }, [setUser, clearIsAuthenticated, router]);

  return <>{children}</>;
};

export default AuthProvider;
