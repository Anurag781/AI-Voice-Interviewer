"use client";
import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { Video } from "lucide-react";
import react, { useEffect, useState } from "react";
import InterviewCard from "../dashboard/_components/interviewcard";
import { useRouter } from "next/navigation";

function AllInterview() {
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
      .order("id", { ascending: false });

    console.log(interviews);
    setInterviewList(interviews);
  };

  return (
    <div className="my-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Previously Created Interviews
          </h2>

          <p className="mt-1 text-[13px] text-slate-500">
            Manage and review all your AI-generated interview sessions.
          </p>
        </div>
      </div>

      {/* Empty State */}
      {InterviewList?.length === 0 ? (
        <div
          className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-slate-200/70
          bg-white/90
          backdrop-blur-xl
          shadow-[0_8px_30px_rgba(15,23,42,0.05)]
          p-7
          flex
          flex-col
          items-center
          gap-3
          text-center
        "
        >
          {/* Soft Glow */}
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 shadow-sm">
            <Video className="h-7 w-7 text-primary" />
          </div>

          <div className="relative z-10 space-y-1">
            <h2 className="text-base font-semibold text-slate-800">
              No interviews created yet
            </h2>

            <p className="max-w-md text-[13px] leading-6 text-slate-500">
              Start creating AI-powered interview sessions to streamline your
              hiring workflow.
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
            shadow-[0_8px_24px_rgba(15,23,42,0.10)]
            hover:shadow-[0_12px_28px_rgba(15,23,42,0.14)]
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
        InterviewList && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {InterviewList.map((interview, index) => (
              <InterviewCard interview={interview} key={index} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
export default AllInterview;
