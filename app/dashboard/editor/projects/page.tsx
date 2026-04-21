"use client";

import { useEffect, useState } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { UnifiedTable } from "../_components/UnifiedTable";

export default function EditorProjectsPage() {
  const { role, user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (role !== "editor" || !user) return;
    
    const q = query(
      collection(db, "tasks"),
      where("assignedEditorId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        clientName: doc.data().clientName || "Unknown Client"
      })));
    });

    return () => unsub();
  }, [role, user]);

  if (role !== "editor") return null;

  return (
    <div className="h-full flex flex-col gap-6 p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tighter uppercase">My <span className="text-zinc-500">Projects</span></h1>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Full Production History</p>
      </div>
      
      <div className="flex-1 min-h-0">
        <UnifiedTable 
          title="Assigned Projects" 
          data={projects} 
          type="projects" 
        />
      </div>
    </div>
  );
}
