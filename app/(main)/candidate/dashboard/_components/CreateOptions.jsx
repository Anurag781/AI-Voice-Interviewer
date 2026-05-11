"use client";
import { Phone, File as FileIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/services/supabaseClient";

function CreateOptions() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (!code.trim()) {
      toast.error("Please enter an interview code.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("interviews")
      .select("interview_id")
      .eq("interview_id", code.trim())
      .single();

    setLoading(false);

    if (error || !data) {
      toast.error("Invalid interview code. Please try again.");
      return;
    }

    toast.success("Redirecting to your interview...");
    router.push(`/interview/${code.trim()}`);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Interview Code Card */}
      <div
        className="
        group
        relative
        overflow-hidden
        rounded-xl
        border
        border-slate-200/70
        bg-white/95
        p-4
        shadow-[0_6px_24px_rgba(15,23,42,0.04)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_10px_32px_rgba(15,23,42,0.07)]
      "
      >
        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative z-10 flex h-full flex-col">
          {/* Icon */}
          <div
            className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            bg-blue-50
            ring-1
            ring-blue-100
          "
          >
            <Phone className="h-4 w-4 text-blue-600" />
          </div>

          {/* Content */}
          <div className="mt-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Interview Code
            </h2>

            <p className="mt-1 text-[13px] leading-5 text-slate-500">
              Enter the code shared by your recruiter to begin your interview.
            </p>
          </div>

          {/* Input */}
          <div className="mt-4">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter interview code"
              className="
              h-10
              rounded-lg
              border-slate-200
              bg-white
              text-sm
              shadow-none
              focus-visible:ring-2
              focus-visible:ring-blue-100
            "
            />
          </div>

          {/* Button */}
          <div className="mt-4">
            <Button
              onClick={handleStart}
              disabled={loading}
              className="
              h-10
              w-full
              rounded-lg
              bg-slate-950
              text-sm
              font-medium
              text-white
              shadow-[0_6px_20px_rgba(15,23,42,0.10)]
              transition-all
              duration-300
              hover:bg-slate-800
              hover:shadow-[0_10px_24px_rgba(15,23,42,0.14)]
              cursor-pointer
            "
            >
              {loading ? "Checking..." : "Start Interview"}
            </Button>
          </div>
        </div>
      </div>

      {/* Upload CV Card */}
      <Link href={"/candidate/upload-cv"} className="block h-full">
        <div
          className="
          group
          relative
          flex
          h-full
          flex-col
          overflow-hidden
          rounded-xl
          border
          border-slate-200/70
          bg-white/95
          p-4
          shadow-[0_6px_24px_rgba(15,23,42,0.04)]
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:shadow-[0_10px_32px_rgba(15,23,42,0.07)]
          cursor-pointer
        "
        >
          {/* Background Glow */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative z-10 flex h-full flex-col">
            {/* Icon */}
            <div
              className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              bg-blue-50
              ring-1
              ring-blue-100
            "
            >
              <FileIcon className="h-4 w-4 text-blue-600" />
            </div>

            {/* Content */}
            <div className="mt-3 flex-1">
              <h2 className="text-sm font-semibold text-slate-900">
                Upload your CV
              </h2>

              <p className="mt-1 text-[13px] leading-5 text-slate-500">
                Upload your resume to apply for AI-powered interviews.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-4">
              <div
                className="
                flex
                h-10
                items-center
                justify-center
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                text-sm
                font-medium
                text-slate-700
                transition-all
                duration-300
                group-hover:border-slate-300
                group-hover:bg-slate-100
              "
              >
                Upload Resume
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CreateOptions;
