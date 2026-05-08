"use client";

import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { ProjectOverview } from "../_components/ProjectOverview";

export default function AdminProjectsPage() {
  const { role } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (role !== "admin") return;
    let isSubscribed = true;
    
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      if (!isSubscribed) return;
      setProjects(snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        clientName: doc.data().clientName || "Unknown Client",
        editorName: doc.data().editorName || "Unassigned",
      })));
    }, (error) => {
      if (error.message.includes('INTERNAL ASSERTION FAILED')) return;
      console.error("Projects fetch error:", error);
    });

    return () => {
      isSubscribed = false;
      unsub();
    };
  }, [role]);

  if (role !== "admin") return null;

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden">
      <div className="flex-1 min-h-0">
        <ProjectOverview projects={projects} />
      </div>
    </div>
  );
}
