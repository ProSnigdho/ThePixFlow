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
  userData: any | null;
  isApproved: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  userData: null,
  isApproved: false,
  loading: true,
  signOut: async () => {},
  updateProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [userData, setUserData] = useState<any | null>(null);
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
    if (!user?.uid) return;

    let isSubscribed = true;
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (userDoc) => {
      if (!isSubscribed) return;
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setRole(data.role || "client");
        setIsApproved(data.isApproved || data.role === "admin");
      } else {
        setUserData(null);
        setRole(null);
        setIsApproved(false);
      }
      setLoading(false);
    }, (error) => {
      if (error.message.includes('INTERNAL ASSERTION FAILED')) return;
      console.error("FIRE_AUTH_SYNC_FAIL:", error);
      setLoading(false);
    });

    return () => {
      isSubscribed = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user?.uid]);

  // 3. PRODUCTION-GRADE: Strict Route Guarding & RBAC
  useEffect(() => {
    if (!authInitialized || loading) return;

    const publicPaths = ["/", "/auth", "/privacy", "/terms"];
    const isPublicPage = publicPaths.includes(pathname);
    const isAuthPage = pathname === "/auth";
    const isPendingPage = pathname === "/pending";

    // 1. Unauthenticated -> Only allow Public Pages
    if (!user) {
      if (!isPublicPage) {
        router.push("/auth");
      }
      return;
    }

    // 2. Pending Approval -> Only allow Pending or Public Pages
    if (user && !isApproved) {
      if (!isPendingPage && !isPublicPage) {
        router.push("/pending");
      }
      return;
    }

    // 3. Authenticated & Approved
    if (user && isApproved) {
      // Protect specific dashboard roots (RBAC)
      const pathParts = pathname.split("/");
      if (pathParts[1] === "dashboard") {
        const pathRole = pathParts[2];
        const isSharedDashboardRoute = ["messages", "settings", "announcements"].includes(pathRole);
        
        if (pathRole && !isSharedDashboardRoute && pathRole !== role && role !== 'admin') {
          console.warn(`RBAC_BLOCK: User [${role}] attempted access to [${pathRole}]`);
          router.push(`/dashboard/${role}`);
          return;
        }
      }

      // If user is logged in and tries to access /auth or /pending, send to dashboard
      if (isAuthPage || isPendingPage) {
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

  const updateProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!user) return;
    try {
      // 1. Update Firestore
      const { updateDoc } = await import("firebase/firestore");
      await updateDoc(doc(db, "users", user.uid), {
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      // 2. Update Firebase Auth Profile
      const { updateProfile: firebaseUpdateProfile } = await import("firebase/auth");
      await firebaseUpdateProfile(user, data);
    } catch (e) {
      console.error("UPDATE_PROFILE_FAIL:", e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, userData, isApproved, loading, signOut, updateProfile }}>
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
