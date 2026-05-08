"use client";

import { useEffect, useState } from "react";
import { collection, query, onSnapshot, where, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { UnifiedTable } from "../_components/UnifiedTable";

export default function EditorCompletedPage() {
  const { role, user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (role !== "editor" || !user) return;
    
    const q = query(
      collection(db, "projects"),
      where("editorId", "==", user.uid),
      where("status", "==", "Completed"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q, 
      (snapshot) => {
        setProjects(snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          clientName: doc.data().clientName || "Unknown Client",
          projectName: doc.data().projectName || "Untitled Project"
        })));
      },
      (error) => {
        console.error("COMPLETED_PROJECTS_ERROR:", error);
      }
    );

    return () => unsub();
  }, [role, user]);

  if (role !== "editor") return null;

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-700 overflow-hidden">
      <div className="flex-1 min-h-0">
        <UnifiedTable 
          title="Completed Works Archive" 
          data={projects} 
          type="projects" 
        />
      </div>
    </div>
  );
}
