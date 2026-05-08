"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, Maximize, Clock, MessageSquare, Send, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/firebase/config";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface Comment {
  id: string;
  text: string;
  timestamp: number;
  userName: string;
  createdAt: any;
}

interface VideoReviewPlayerProps {
  projectId: string;
  fileId: string;
}

export function VideoReviewPlayer({ projectId, fileId }: VideoReviewPlayerProps) {
  const { user, userData } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  // 1. Fetch Comments
  useEffect(() => {
    const q = query(
      collection(db, "projects", projectId, "feedback"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Comment[]);
    });

    return () => unsub();
  }, [projectId]);

  // 2. Video Logic
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 3. Comment Logic
  const postComment = async () => {
    if (!newComment.trim() || !user) return;

    try {
      await addDoc(collection(db, "projects", projectId, "feedback"), {
        text: newComment,
        timestamp: currentTime,
        userId: user.uid,
        userName: userData?.displayName || user.displayName || "Member",
        createdAt: serverTimestamp(),
      });
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 overflow-hidden">
      {/* Video Side */}
      <div className="flex flex-col gap-4 min-h-0">
        <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/5 group shadow-2xl">
          <video 
            ref={videoRef}
            src={`/api/video/stream/${fileId}`}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
          />
          
          {/* Custom Controls */}
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex flex-col gap-4">
              {/* Progress Bar */}
              <div 
                className="h-1.5 w-full bg-white/10 rounded-full cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  handleSeek(percent * duration);
                }}
              >
                <div 
                  className="absolute inset-y-0 left-0 bg-[#1A8080] rounded-full transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                {/* Comment Markers */}
                {comments.map(c => (
                  <div 
                    key={c.id}
                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3 bg-orange-500 rounded-full border border-black cursor-help"
                    style={{ left: `${(c.timestamp / duration) * 100}%` }}
                    title={c.text}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button onClick={togglePlay} className="text-white hover:text-[#1A8080] transition-colors">
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                  </button>
                  <div className="flex items-center gap-2 text-white/50 text-xs font-mono">
                    <span className="text-white">{formatTime(currentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Volume2 size={20} className="text-white/50" />
                  <Maximize size={20} className="text-white/50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Comment Input */}
        <div className="flex gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#1A4848]/20 border border-[#1A4848]/30 rounded-lg text-[10px] font-black text-[#1A8080] uppercase">
            <Clock size={12} /> {formatTime(currentTime)}
          </div>
          <input 
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && postComment()}
            placeholder="Add timestamped feedback..."
            className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none placeholder:text-zinc-600"
          />
          <button 
            onClick={postComment}
            className="p-2 bg-[#1A4848] text-white rounded-xl hover:bg-[#1A8080] transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Sidebar Side: Feedback Feed */}
      <div className="flex flex-col bg-black/20 border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <MessageSquare size={14} className="text-orange-500" />
            Feedback Loop
          </h3>
          <span className="text-[8px] bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded font-black uppercase">{comments.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-6">
              <MessageSquare size={32} className="mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">No feedback yet.<br/>Type above to start the loop.</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div 
                key={comment.id}
                className="group p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-all cursor-pointer"
                onClick={() => handleSeek(comment.timestamp)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-white uppercase">{comment.userName}</span>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-orange-500 uppercase">
                    <Clock size={10} /> {formatTime(comment.timestamp)}
                  </div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
