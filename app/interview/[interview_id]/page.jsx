"use client";
import React, { useEffect, useState, useContext, use } from "react";
import Image from "next/image";
import { Clock, Mic, Video, CheckCircle, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { motion } from "framer-motion";
import { useUser } from "@/app/provider";
import axios from "axios";

function Interview() {
  const params = useParams();
  const interview_id = params?.interview_id;
  const [interviewData, setInterviewData] = useState(null);
  const [userName, setUserName] = useState("");
  const [useremail, setuseremail] = useState("");
  // const [interviewDetails, setInterviewDetails] = useState('');
  // const [interviewQuestions, setInterviewQuestions] = useState('');
  // const [interviewDuration, setInterviewDuration] = useState('');
  // const [interviewType, setInterviewType] = useState('');
  // const [interviewstatus, setinterviewstatus] = useState('pending');
  // const [interviewDate, setInterviewDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const router = useRouter();
  const [accessDenied, setAccessDenied] = useState(false);
  const { user } = useUser();

  let provider = null;
  if (typeof window !== "undefined") {
    try {
      provider = JSON.parse(localStorage.getItem("supabase.auth.token"))
        ?.currentSession?.user?.app_metadata?.provider;
    } catch {}
  }
  const isGoogleUser = provider === "google";

  useEffect(() => {
    if (interview_id) GetInterviewDetails();
  }, [interview_id]);

  useEffect(() => {
    const checkAccess = async () => {
      // 1. Get current session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/login");
        return;
      }
      // No email comparison, just require a session
      setAccessDenied(false);
    };
    checkAccess();
  }, [interviewData, interview_id]);

  useEffect(() => {
    if (user && !useremail) setuseremail(user.email || "");
    if (user && !userName) setUserName(user.name || "");
  }, [user]);

  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      const { data: interviews, error } = await supabase
        .from("interviews")
        .select(
          "useremail, jobposition, jobdescription, duration, type, questionlist",
        )
        .eq("interview_id", interview_id);

      if (error) throw error;
      if (!interviews?.length) throw new Error("No interview found");

      console.log("interviews:", interviews);
      // Set the interview data to state

      setInterviewData(interviews[0]);
    } catch (error) {
      toast.error(error.message || "Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  const validateJoin = () => {
    if (!userName.trim()) {
      toast.warning("Full name is required");
      return false;
    }

    if (userName.trim().split(" ").length < 2) {
      toast.warning("Please provide your full name (e.g., First Last)");
      return false;
    }

    return true;
  };

  const onJoinInterview = async () => {
    if (!validateJoin()) return; // Deny entry if validation fails

    try {
      const newInterviewInfo = {
        ...interviewInfo,
        candidate_name: userName,
        jobposition: interviewData?.jobposition,
        jobdescription: interviewData?.jobdescription,
        duration: interviewData?.duration,
        useremail: useremail,
        type: interviewData?.type,
        questionlist: interviewData?.questionlist, // Use the existing questions
        interview_id: interview_id,
      };
      setInterviewInfo(newInterviewInfo);

      if (typeof window !== "undefined") {
        localStorage.setItem("interviewInfo", JSON.stringify(newInterviewInfo));
      }
      toast.success("Creating your interview session...");
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Smooth delay
      router.push(`/interview/${interview_id}/start`);
    } catch (error) {
      toast.error("Connection failed");
    }
  };

  if (accessDenied) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You do not have permission to access this interview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom_right,#f8fafc,white,#f1f5f9)] px-4 py-5 sm:px-5">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl"
      >
        {/* Header */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="mb-6 flex flex-col items-center"
        >
          <div className="relative mb-3 h-20 w-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 24,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-full border border-dashed border-blue-200"
            />

            <Image
              src="/Logo.png"
              alt="Logo"
              fill
              className="object-contain p-0"
              priority
            />
          </div>

          <h1
            className="
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            bg-clip-text
            text-[26px]
            font-bold
            tracking-tight
            text-transparent
          "
          >
            AI Interview Portal
          </h1>

          <p className="mt-1.5 text-[13px] text-slate-500">
            Next-generation hiring experience
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          whileHover={{ y: -2 }}
          className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200/70
          bg-white/95
          shadow-[0_10px_40px_rgba(15,23,42,0.05)]
          backdrop-blur-xl
        "
        >
          {/* Interview Header */}
          <div
            className="
            bg-gradient-to-r
            from-blue-600
            via-indigo-600
            to-indigo-700
            px-5
            py-4
          "
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[20px] font-semibold text-white">
                  {interviewData?.jobposition || "AI Interview"}
                </h2>

                <div className="mt-1.5 flex items-center gap-2 text-blue-100">
                  <Clock className="h-3.5 w-3.5" />

                  <span className="text-[12px]">
                    {interviewData?.duration || "30 min"}
                  </span>
                </div>
              </div>

              <div
                className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-white/10
                bg-white/10
                px-3
                py-1.5
              "
              >
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                <span className="text-[11px] font-medium text-white">
                  Live Session Ready
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 md:p-6">
            {/* Timeline */}
            <div className="mb-7 flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dashed border-slate-200" />
                </div>

                <div className="relative flex justify-between">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-blue-200
                        bg-blue-50
                      "
                      >
                        <span className="text-[12px] font-semibold text-blue-700">
                          {step}
                        </span>
                      </div>

                      <span className="mt-1.5 text-[10px] text-slate-500">
                        {["Setup", "Interview", "Results"][step - 1]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="mb-1.5 block text-[12px] font-medium text-slate-700">
                  Your Full Name
                </label>

                <Input
                  placeholder="Eg: Sujeeth Kumar"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="
                  h-10
                  rounded-xl
                  border-slate-200
                  bg-white
                  px-4
                  text-sm
                  shadow-sm
                  focus-visible:ring-4
                  focus-visible:ring-blue-100
                "
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="mb-1.5 block text-[12px] font-medium text-slate-700">
                  Professional Email
                </label>

                <Input
                  type="email"
                  placeholder="Eg: Sujeethkumar@example.com"
                  value={useremail}
                  onChange={(e) => setuseremail(e.target.value)}
                  className="
                  h-10
                  rounded-xl
                  border-slate-200
                  bg-white
                  px-4
                  text-sm
                  shadow-sm
                  focus-visible:ring-4
                  focus-visible:ring-blue-100
                "
                />
              </motion.div>

              {/* Checklist */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="
                rounded-xl
                border
                border-blue-100
                bg-blue-50/40
                p-4
              "
              >
                <h4
                  className="
                  mb-3
                  flex
                  items-center
                  gap-2
                  text-[13px]
                  font-semibold
                  text-slate-800
                "
                >
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  Preparation Checklist
                </h4>

                <ul className="space-y-2.5">
                  {[
                    "Provide a proper name & valid email address",
                    "Give access to your microphone",
                    "Ensure a stable internet connection",
                    "Enable camera permissions",
                    "Use Chrome or Edge browser",
                    "Find a quiet environment",
                    "Have your resume handy",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div
                        className="
                        mt-1
                        flex
                        h-3.5
                        w-3.5
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-blue-200
                        bg-blue-100
                      "
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      </div>

                      <span className="text-[12px] text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Button */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-1"
              >
                <Button
                  onClick={onJoinInterview}
                  className={`
                  h-11
                  w-full
                  rounded-xl
                  bg-blue-600
                  text-sm
                  font-medium
                  text-white
                  shadow-[0_8px_24px_rgba(37,99,235,0.18)]
                  transition-all
                  duration-300
                  hover:bg-blue-700
                  hover:shadow-[0_12px_28px_rgba(37,99,235,0.22)]
                  ${!loading && "hover:-translate-y-0.5"}
                `}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>

                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                      Preparing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Video className="h-4 w-4" />
                      Start Interview Session
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center text-[11px] text-slate-500"
        >
          Powered by AI interview technology • Secure and confidential
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Interview;
