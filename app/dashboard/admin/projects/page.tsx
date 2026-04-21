"use client";

import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { MasterProductionGrid } from "../_components/MasterProductionGrid";

export default function AdminProjectsPage() {
  const { role } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    if (role !== "admin") return;
    
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        clientName: doc.data().clientName || "Pure Athletics",
        editorName: doc.data().editorName || "Alex Edits",
        profit: doc.data().profit || "450"
      })));
    });

    return () => unsub();
  }, [role]);

  if (role !== "admin") return null;

  return (
    <div className="h-full flex flex-col gap-6 p-6 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tighter uppercase">Master <span className="text-zinc-500">Inventory</span></h1>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Global Production Oversight</p>
      </div>

      <div className="flex-1 min-h-0">
        <MasterProductionGrid tasks={tasks} />
      </div>
    </div>
  );
}
