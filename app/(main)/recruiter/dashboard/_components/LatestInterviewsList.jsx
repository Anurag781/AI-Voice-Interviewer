"use client";
import { Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { useUser } from "@/app/provider";
import InterviewCard from "./interviewcard";
import { toast } from "sonner";

function LatestinterviewsList() {
  const router = useRouter();

  const [InterviewList, setInterviewList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
    let { data: interviews, error } = await supabase
      .from("interviews")
      .select("*, interview_results(*)") // <-- JOIN the related table
      .eq("useremail", user?.email)
      .order("id", { ascending: false })
      .limit(6);

    console.log(interviews);
    setInterviewList(interviews);
  };

  const handleInterviewDelete = () => {
    // Refresh the interview list after deletion
    GetInterviewList();
  };

  return (
    <div className="my-4 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Previously Created Interviews
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Manage your recent AI interviews.
        </p>
      </div>

      {/* Empty State */}
      {InterviewList?.length === 0 ? (
        <div
          className="
          relative
          overflow-hidden
          rounded-xl
          border
          border-slate-200/70
          bg-white/90
          p-6
          text-center
          shadow-[0_6px_24px_rgba(15,23,42,0.04)]
        "
        >
          {/* Soft Glow */}
          <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 rounded-full bg-blue-100/40 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 shadow-sm">
              <Video className="h-6 w-6 text-blue-600" />
            </div>

            {/* Title */}
            <h2 className="mt-4 text-base font-semibold text-slate-900">
              No interviews created yet
            </h2>

            {/* Description */}
            <p className="mt-1.5 max-w-sm text-xs leading-5 text-slate-500">
              Start creating AI-powered interviews for smarter hiring.
            </p>

            {/* Button */}
            <Button
              className="
              mt-4
              h-9
              rounded-lg
              bg-slate-950
              px-4
              text-xs
              text-white
              shadow-[0_6px_20px_rgba(15,23,42,0.08)]
              transition-all
              duration-300
              hover:bg-slate-800
              cursor-pointer
            "
              onClick={() =>
                router.push("/recruiter/dashboard/create-interview")
              }
            >
              + Create New Interview
            </Button>
          </div>
        </div>
      ) : (
        InterviewList && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {InterviewList.map((interview, index) => (
              <InterviewCard
                interview={interview}
                key={index}
                onDelete={handleInterviewDelete}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default LatestinterviewsList;
