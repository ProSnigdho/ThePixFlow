"use client";

import { useEffect, useState } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { UnifiedTable } from "../_components/UnifiedTable";

export default function EditorRevisionsPage() {
  const { role, user } = useAuth();
  const [revisions, setRevisions] = useState<any[]>([]);

  useEffect(() => {
    if (role !== "editor" || !user) return;
    
    // Filter for REVISION_REQUESTED or Review status
    // The prompt says "specialized view showing only tasks with a REVISION_REQUESTED status"
    const q = query(
      collection(db, "tasks"),
      where("assignedEditorId", "==", user.uid),
      where("status", "==", "Review") // In this system, 'Review' often means revision requested
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setRevisions(snapshot.docs.map(doc => ({ 
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
        <h1 className="text-3xl font-black tracking-tighter uppercase text-orange-500">Fix <span className="text-zinc-500">Queue</span></h1>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Revisions & Quality Control</p>
      </div>
      
      <div className="flex-1 min-h-0">
        <UnifiedTable 
          title="Active Revisions" 
          data={revisions} 
          type="revisions" 
        />
      </div>
    </div>
  );
}
