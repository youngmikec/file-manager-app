"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const checked: boolean = true

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  if (!checked) return null;

  return <>{children}</>;
}