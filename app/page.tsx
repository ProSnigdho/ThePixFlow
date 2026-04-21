"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex bg-black items-center justify-center min-h-screen text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#833ab4]"></div>
      </div>
    </div>
  );
}
