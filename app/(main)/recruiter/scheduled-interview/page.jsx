"use client";
import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import InterviewCard from "../dashboard/_components/interviewcard";
import { useRouter } from "next/navigation";

function ScheduledInterview() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState();

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);
  const GetInterviewList = async () => {
    const result = await supabase
      .from("interviews")
      .select(
        `
      jobposition,
      duration,
      interview_id,
      interview_results (
        email,
        conversation_transcript,
        completed_at
      )
    `,
      )
      .eq("useremail", user?.email)
      .order("id", { ascending: false });

    console.log(result);
    setInterviewList(result.data);
  };

  return (
    <div className="my-5 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Interview List with Feedback
        </h2>

        <p className="mt-1 text-[13px] text-slate-500">
          Review completed interviews and candidate feedback reports.
        </p>
      </div>

      {/* Empty State */}
      {interviewList?.length === 0 ? (
        <div
          className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-slate-200/70
          bg-white/90
          shadow-[0_8px_28px_rgba(15,23,42,0.05)]
          p-6
          flex
          flex-col
          items-center
          gap-3
          text-center
        "
        >
          {/* Soft Glow */}
          <div className="absolute top-0 right-0 h-28 w-28 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 shadow-sm">
            <Video className="h-6 w-6 text-primary" />
          </div>

          <div className="relative z-10 space-y-1">
            <h2 className="text-base font-semibold text-slate-800">
              No interviews found
            </h2>

            <p className="max-w-md text-[13px] leading-6 text-slate-500">
              Create and manage AI-powered interviews to receive detailed
              candidate feedback.
            </p>
          </div>

          <Button
            className="
            relative
            z-10
            mt-1
            h-10
            rounded-xl
            bg-slate-950
            px-4
            text-sm
            text-white
            hover:bg-slate-800
            shadow-[0_8px_24px_rgba(15,23,42,0.08)]
            transition-all
            duration-300
            cursor-pointer
          "
            onClick={() => router.push("/recruiter/dashboard/create-interview")}
          >
            + Create New Interview
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {interviewList?.map((interview, index) => (
            <InterviewCard
              interview={interview}
              key={index}
              viewDetail={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ScheduledInterview;
