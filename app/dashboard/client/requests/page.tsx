"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  User,
  ArrowRight,
  Link as LinkIcon,
  CheckCircle2,
  Calendar as CalendarIcon,
  Video,
  Film,
  Smartphone,
  Briefcase,
  Zap,
  Play,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FloatingCalendar } from "./_components/FloatingCalendar";
import { LinkValidatorPopup } from "./_components/LinkValidatorPopup";
import { DrivePreviewWidget } from "./_components/DrivePreviewWidget";

const CONTENT_TYPES = [
  {
    id: "Cinematic",
    title: "Cinematic",
    icon: Film,
    description: "High-end storytelling & color grading",
  },
  {
    id: "Social Media",
    title: "Social Media",
    icon: Smartphone,
    description: "Fast-paced, high engagement 9:16",
  },
  {
    id: "Corporate",
    title: "Corporate",
    icon: Briefcase,
    description: "Professional & polished brand videos",
  },
  {
    id: "Ad Campaign",
    title: "Ad Campaign",
    icon: Zap,
    description: "Conversion focused video assets",
  },
];

import { NotificationCenter } from "@/components/NotificationCenter";

export default function StartProjectPage() {
  const { user, userData } = useAuth();
  const displayName = userData?.displayName || user?.displayName || "User";
  const firstName = displayName.split(" ")[0];
  const photoURL = userData?.photoURL || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`;

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isLinkValid, setIsLinkValid] = useState(true);

  // Drive Regex for strict validation
  const driveRegex =
    /^https:\/\/(?:drive|docs)\.google\.com\/(?:file\/d\/|drive\/folders\/|open\?id=|spreadsheets\/d\/|presentation\/d\/)([a-zA-Z0-9_-]+)/;

  const validateLinks = (video: string, reference: string) => {
    const isVideoDrive =
      video.includes("drive.google.com") || video.includes("docs.google.com");
    const isRefDrive =
      reference.includes("drive.google.com") ||
      reference.includes("docs.google.com");

    const videoValid = !isVideoDrive || driveRegex.test(video);
    const refValid = !isRefDrive || driveRegex.test(reference);

    setIsLinkValid(videoValid && refValid);
  };

  // Form State
  const [formData, setFormData] = useState({
    projectName: "",
    videoType: "Cinematic",
    desiredDelivery: "",
    description: "",
    videoLink: "",
    referenceLinks: "",
  });

  useEffect(() => {
    return () => setIsSubmitting(false);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    if (name === "videoLink" || name === "referenceLinks") {
      validateLinks(newFormData.videoLink, newFormData.referenceLinks);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.uid) {
      toast.error("Authentication required.");
      return;
    }

    if (
      !formData.projectName ||
      !formData.videoLink ||
      !formData.desiredDelivery
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!isLinkValid) {
      toast.error(
        "Access Denied or Invalid Link. Please fix the Google Drive URL.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        clientId: user.uid,
        clientName: user.displayName || "Client",
        projectName: formData.projectName,
        videoType: formData.videoType,
        desiredDelivery: formData.desiredDelivery,
        description: formData.description,
        videoLink: formData.videoLink,
        referenceLinks: formData.referenceLinks,
        status: "Queue",
        createdAt: serverTimestamp(),
        startDate: serverTimestamp(),
      };

      await addDoc(collection(db, "projects"), payload);
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/dashboard/client");
      }, 2000);
    } catch (error: any) {
      console.error("Submission error: ", error);
      toast.error(`Submission failed: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#0A0A0A] text-zinc-400 font-sans overflow-hidden flex flex-col gap-6 relative">
      {/* Success Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 rounded-full bg-[#1A4848]/20 border border-[#1A4848] flex items-center justify-center mb-6"
            >
              <CheckCircle2 size={48} className="text-[#1A8080]" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Project Successfully Queued
            </h2>
            <p className="text-zinc-500">Redirecting to your dashboard...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex justify-center overflow-hidden">
        <div className="w-full max-w-3xl flex flex-col min-h-0">
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto no-scrollbar premium-glass p-10 flex flex-col border-white/5 rounded-[2.5rem] shadow-2xl"
          >
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-3">
                Creative Brief
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Provide your project details below to start the project.
              </p>
            </div>

            <div className="space-y-12">
              {/* Project Name Input */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <Video size={14} className="text-[#1A8080]" /> Project Name
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="e.g. Autumn Fashion Campaign"
                  className="w-full bg-zinc-900/50 border border-white/10 focus:border-[#1A4848] rounded-2xl p-5 text-sm text-white focus:outline-none transition-all placeholder:text-zinc-800"
                  required
                />
              </div>

              {/* Visual Selectable Cards for Content Type */}
              <div className="space-y-6">
                <label className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <Film size={14} className="text-[#1A8080]" /> Content Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CONTENT_TYPES.map((type) => {
                    const isSelected = formData.videoType === type.id;
                    return (
                      <div
                        key={type.id}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            videoType: type.id,
                          }))
                        }
                        className={cn(
                          "relative p-5 rounded-2xl border transition-all cursor-pointer group flex items-center gap-4",
                          isSelected
                            ? "bg-[#1A4848]/10 border-[#1A4848] shadow-[0_0_20px_rgba(26,72,72,0.2)]"
                            : "bg-zinc-900/40 border-white/5 hover:border-white/10",
                        )}
                      >
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                            isSelected
                              ? "bg-[#1A4848] text-white"
                              : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-300",
                          )}
                        >
                          <type.icon size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-sm font-bold transition-colors",
                              isSelected ? "text-white" : "text-zinc-400",
                            )}
                          >
                            {type.title}
                          </p>
                          <p className="text-[10px] text-zinc-600 truncate mt-0.5">
                            {type.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1A8080] flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modern Date Picker Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <CalendarIcon size={14} className="text-[#1A8080]" /> Target
                  Deadline
                </label>
                <div className="relative group max-w-sm">
                  {/* Custom Styled Trigger */}
                  <div
                    onClick={() => setShowCalendar(!showCalendar)}
                    className={cn(
                      "w-full bg-zinc-900/50 border hover:border-[#1A4848]/50 rounded-2xl p-5 flex items-center justify-between cursor-pointer transition-all group shadow-inner",
                      showCalendar
                        ? "border-[#1A4848] ring-1 ring-[#1A4848]/20"
                        : "border-white/10",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-[#1A4848]/10 text-[#1A8080] group-hover:bg-[#1A4848]/20 transition-colors">
                        <CalendarIcon size={18} />
                      </div>
                      <div>
                        <p
                          className={cn(
                            "text-sm font-bold transition-colors",
                            formData.desiredDelivery
                              ? "text-white"
                              : "text-zinc-600",
                          )}
                        >
                          {formData.desiredDelivery
                            ? format(
                                new Date(formData.desiredDelivery),
                                "MMMM dd, yyyy",
                              )
                            : "Select Project Deadline"}
                        </p>
                        <p className="text-[10px] text-zinc-700 mt-0.5 uppercase tracking-wider font-bold">
                          Priority Scheduling
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      size={16}
                      className={cn(
                        "transition-all duration-500",
                        showCalendar
                          ? "text-[#1A8080] rotate-90"
                          : "text-zinc-800 group-hover:text-[#1A8080] group-hover:translate-x-1",
                      )}
                    />
                  </div>

                  {/* Floating Calendar Component */}
                  <AnimatePresence>
                    {showCalendar && (
                      <FloatingCalendar
                        selectedDate={
                          formData.desiredDelivery
                            ? new Date(formData.desiredDelivery)
                            : null
                        }
                        onSelect={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            desiredDelivery: format(date, "yyyy-MM-dd"),
                          }));
                          setShowCalendar(false);
                        }}
                        onClose={() => setShowCalendar(false)}
                      />
                    )}
                  </AnimatePresence>

                  {/* Hidden Input for Form Submission */}
                  <input
                    type="hidden"
                    name="desiredDelivery"
                    value={formData.desiredDelivery}
                    required
                  />
                </div>
              </div>

              {/* Source Link Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <LinkIcon size={14} className="text-[#1A8080]" /> Raw Footage
                  Source
                </label>
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className="relative flex-1 w-full">
                    {/* Link Validator Popup for Footage */}
                    <LinkValidatorPopup
                      url={formData.videoLink}
                      isVisible={
                        formData.videoLink.includes("drive.google.com") ||
                        formData.videoLink.includes("docs.google.com")
                      }
                    />

                    <input
                      type="url"
                      name="videoLink"
                      value={formData.videoLink}
                      onChange={handleInputChange}
                      placeholder="Link to your assets (Drive, Dropbox, etc.)"
                      className="w-full bg-[#1A4848]/5 border border-[#1A4848]/20 focus:border-[#1A4848] rounded-2xl p-5 pl-14 text-sm text-white focus:outline-none transition-all placeholder:text-zinc-800"
                      required
                    />
                    <LinkIcon
                      size={20}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1A4848]/60"
                    />
                  </div>

                  {/* Live Preview Widget */}
                  <DrivePreviewWidget
                    url={formData.videoLink}
                    isValid={
                      formData.videoLink.includes("drive.google.com") &&
                      driveRegex.test(formData.videoLink)
                    }
                  />
                </div>
              </div>

              {/* Reference Link Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <Play size={14} className="text-[#1A8080]" /> Reference Style
                  (Optional)
                </label>
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className="relative flex-1 w-full">
                    {/* Link Validator Popup */}
                    <LinkValidatorPopup
                      url={formData.referenceLinks}
                      isVisible={
                        formData.referenceLinks.includes("drive.google.com") ||
                        formData.referenceLinks.includes("docs.google.com")
                      }
                    />

                    <input
                      type="url"
                      name="referenceLinks"
                      value={formData.referenceLinks}
                      onChange={handleInputChange}
                      placeholder="YouTube or Vimeo links for inspiration..."
                      className="w-full bg-zinc-900/50 border border-white/10 focus:border-[#1A4848] rounded-2xl p-5 pl-14 text-sm text-white focus:outline-none transition-all placeholder:text-zinc-800"
                    />
                    <Play
                      size={20}
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-800"
                    />
                  </div>

                  {/* Live Preview Widget */}
                  <DrivePreviewWidget
                    url={formData.referenceLinks}
                    isValid={
                      formData.referenceLinks.includes("drive.google.com") &&
                      driveRegex.test(formData.referenceLinks)
                    }
                  />
                </div>
              </div>

              {/* Creative Goal Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-white uppercase tracking-[0.2em]">
                  Creative Goal & Notes
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell us about the mood, pacing, and core message..."
                  className="w-full h-40 bg-zinc-900/50 border border-white/10 focus:border-[#1A4848] rounded-2xl p-6 text-sm text-white focus:outline-none resize-none transition-all placeholder:text-zinc-800"
                />
              </div>
            </div>

            {/* Final Action */}
            <div className="mt-16">
              <button
                type="submit"
                disabled={isSubmitting || !isLinkValid}
                className={cn(
                  "w-full py-5 text-white rounded-2xl text-base font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group overflow-hidden relative",
                  isSubmitting || !isLinkValid
                    ? "bg-zinc-800 cursor-not-allowed opacity-50"
                    : "bg-[#1A4848] hover:bg-[#1A8080] shadow-[0_10px_40px_rgba(26,72,72,0.4)]",
                )}
              >
                <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                {isSubmitting ? "Initializing Suite..." : "Launch Project"}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform duration-500"
                />
              </button>
              <p className="text-center text-[10px] text-zinc-700 mt-6 uppercase tracking-[0.4em] font-bold">
                Secure Intake Encryption • v2.0
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
