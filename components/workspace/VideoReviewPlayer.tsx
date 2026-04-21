"use client";

import React, { useRef, useState, useEffect } from 'react';
import { db } from '@/firebase/config';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { Play, Pause, RotateCcw, Send, Clock, User } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface Comment {
  id: string;
  time: number;
  text: string;
  userRole: string;
  userName: string;
  createdAt: any;
}

interface VideoReviewPlayerProps {
  projectId: string;
  fileId: string;
}

export function VideoReviewPlayer({ projectId, fileId }: VideoReviewPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const { user, role } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, 'projects', projectId, 'feedback'),
      orderBy('time', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(docs);
    });

    return () => unsubscribe();
  }, [projectId]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    await addDoc(collection(db, 'projects', projectId, 'feedback'), {
      time: currentTime,
      text: commentText,
      userRole: role,
      userName: user.displayName || 'User',
      createdAt: serverTimestamp(),
    });

    setCommentText('');
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full max-h-[calc(100vh-120px)]">
      {/* Video Section - 45% proportional width handled by grid-cols-12 */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <GlassCard className="relative overflow-hidden bg-black aspect-video flex items-center justify-center">
          <video
            ref={videoRef}
            src={`/api/video/stream/${fileId}`}
            className="w-full h-full"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />
          
          {/* Custom Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="text-white">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <div className="flex-1 h-1 bg-white/20 rounded-full relative cursor-pointer">
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" 
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <span className="text-white text-xs font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Comment Input */}
        <GlassCard className="p-4">
          <form onSubmit={addComment} className="flex gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10 text-blue-400 font-mono text-sm">
              <Clock size={14} />
              {formatTime(currentTime)}
            </div>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add feedback at this timestamp..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500/50"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Send size={18} />
              Post
            </button>
          </form>
        </GlassCard>
      </div>

      {/* Feedback Side Panel - 27% proportional width */}
      <GlassCard className="lg:col-span-4 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-white font-semibold">Feedback Loop</h3>
          <span className="text-white/40 text-xs">{comments.length} Comments</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div 
              key={comment.id}
              onClick={() => handleSeek(comment.time)}
              className="group p-3 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-white/10 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <User size={12} className="text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-white/80">{comment.userName}</span>
                </div>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
                  {formatTime(comment.time)}
                </span>
              </div>
              <p className="text-sm text-white/60 group-hover:text-white/90 transition-colors">
                {comment.text}
              </p>
            </div>
          ))}
          
          {comments.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-white/20 py-20">
              <RotateCcw size={40} className="mb-4" />
              <p className="text-center text-sm">No feedback yet.<br/>Start the review!</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
