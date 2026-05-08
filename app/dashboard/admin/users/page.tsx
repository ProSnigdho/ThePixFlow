"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { UserTable } from "../_components/UserTable";

export default function AdminUsersPage() {
  const { role } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "admin") return;

    let isSubscribed = true;
    
    // We order by createdAt. Note: This may require a composite index if we were filtering as well, 
    // but just an orderBy on a collection usually works or requires a simple index on createdAt.
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!isSubscribed) return;
        setUsers(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            let createdAt = "Unknown";
            if (data.createdAt?.toDate) {
              createdAt = data.createdAt.toDate().toLocaleDateString();
            } else if (typeof data.createdAt === 'string') {
              createdAt = new Date(data.createdAt).toLocaleDateString();
            } else if (typeof data.createdAt === 'number') {
              createdAt = new Date(data.createdAt).toLocaleDateString();
            }

            return {
              id: doc.id,
              ...data,
              createdAt,
            };
          })
        );
        setLoading(false);
      },
      (error) => {
        if (error.message.includes("INTERNAL ASSERTION FAILED")) return;
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    );

    return () => {
      isSubscribed = false;
      unsub();
    };
  }, [role]);

  if (role !== "admin") return null;

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden">
      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="h-full w-full bg-white/[0.02] border border-white/5 rounded-3xl animate-pulse" />
        ) : (
          <UserTable data={users} />
        )}
      </div>
    </div>
  );
}
