"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { useRouter, usePathname } from "next/navigation";

import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { AnimatePresence } from "framer-motion";

export type Role = "client" | "editor" | "admin" | "sales" | "marketing" | null;

interface AuthContextType {
  user: User | null;
  role: Role;
  isApproved: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isApproved: false,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 1. Handle Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthInitialized(true);
      if (!firebaseUser) {
        setRole(null);
        setIsApproved(false);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Handle User Data Listener (Decoupled & Robust)
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (userDoc) => {
      if (userDoc.exists()) {
        const data = userDoc.data();
        setRole(data.role || "client");
        setIsApproved(data.isApproved || data.role === "admin");
      } else {
        setRole(null);
        setIsApproved(false);
      }
      setLoading(false);
    }, (error) => {
      console.error("FIRE_AUTH_SYNC_FAIL:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. PRODUCTION-GRADE: Strict Route Guarding & RBAC
  useEffect(() => {
    if (!authInitialized || loading) return;

    const authPaths = ["/auth"];
    const isAuthPage = authPaths.includes(pathname);
    const isPendingPage = pathname === "/pending";

    // Unauthenticated -> Auth Page
    if (!user) {
      if (!isAuthPage) router.push("/auth");
      return;
    }

    // Pending Approval -> Pending Page
    if (user && !isApproved) {
      if (!isPendingPage) router.push("/pending");
      return;
    }

    // Authenticated & Approved
    if (user && isApproved) {
      // 1. Protect specific dashboard roots (RBAC)
      const pathParts = pathname.split("/");
      if (pathParts[1] === "dashboard") {
        const pathRole = pathParts[2];
        if (pathRole && pathRole !== role && role !== 'admin') {
          // Unauthorized access attempt to another role's dashboard
          console.warn(`RBAC_BLOCK: User [${role}] attempted access to [${pathRole}]`);
          router.push(`/dashboard/${role}`);
          return;
        }
      }

      // 2. Redirect from Auth/Landing to Dashboard
      if (isAuthPage || isPendingPage || pathname === "/") {
        let target = `/dashboard/${role}`;
        if (role === "admin") target = "/dashboard/admin";
        router.push(target);
      }
    }
  }, [user, loading, isApproved, role, pathname, router, authInitialized]);

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      router.push("/auth");
    } catch (e) {
      console.error("SIGNOUT_FAIL:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isApproved, loading, signOut }}>
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingOverlay key="loading" />
        ) : (
          <div key="content" className="contents">
            {children}
          </div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}
