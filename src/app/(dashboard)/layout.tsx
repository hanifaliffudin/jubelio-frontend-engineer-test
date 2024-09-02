"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { fetchCurrentUser, refreshSession } from "../api/auth";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const path = usePathname();
  const { token, refreshToken, updateToken, updateRefreshToken } =
    useAuthStore();

  // logout
  const handleLogout = () => {
    updateToken("");
    updateRefreshToken("");
    router.push("/");
  };

  const checkAuth = async () => {
    try {
      const fetchMe = await fetchCurrentUser(token);
      if (fetchMe.status === 401) {
        // refreshToken
        const fetchRefreshToken = await refreshSession(refreshToken);
        const dataRefreshToken = await fetchRefreshToken.json();
        updateToken(dataRefreshToken.token);
        updateRefreshToken(dataRefreshToken.refreshToken);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) checkAuth();
  }, [path, token, refreshToken]);

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-10 w-52 hidden flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link href={"/products"}>Products</Link>
          <Link href={"/carts"}>Carts</Link>
        </nav>
      </aside>
      <main className="pl-52 bg-muted/40 h-screen">
        <div className="flex z-10 bg-white w-full pr-56 fixed h-14 justify-end items-center p-4 font-semibold">
          <Button
            className="text-red-500"
            variant="secondary"
            onClick={() => handleLogout()}
          >
            Logout
          </Button>
        </div>
        <div className="h-16"></div>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
