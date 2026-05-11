import { Phone, Video, Coins, AlertCircle } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";

function CreateOptions() {
  const { user } = useUser();
  const hasCredits = (user?.credits || 0) > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className={`relative ${!hasCredits ? "opacity-75" : ""}`}>
        <Link href={hasCredits ? "/recruiter/dashboard/create-interview" : "#"}>
          <div
            className={`
            relative
            overflow-hidden
            rounded-xl
            border
            border-slate-200/70
            bg-white/90
            p-4
            shadow-[0_6px_24px_rgba(15,23,42,0.04)]
            transition-all
            duration-300
            ${
              hasCredits
                ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(15,23,42,0.06)]"
                : "cursor-not-allowed"
            }
          `}
          >
            {/* Soft Glow */}
            <div className="pointer-events-none absolute top-0 right-0 h-20 w-20 rounded-full bg-blue-100/40 blur-3xl" />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 shadow-sm">
                <Video className="h-5 w-5 text-blue-600" />
              </div>

              {!hasCredits && (
                <div className="flex items-center gap-1 rounded-full border border-red-100 bg-red-50 px-2 py-1">
                  <AlertCircle className="h-3 w-3 text-red-500" />

                  <span className="text-[10px] font-medium text-red-600">
                    No Credits
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="relative z-10 mt-4">
              <h2 className="text-base font-semibold text-slate-900">
                Create New Interview
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                Create AI interviews and schedule them with candidates.
              </p>

              {/* Cost */}
              <div className="mt-3 flex w-fit items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50/70 px-2.5 py-1.5">
                <Coins className="h-3.5 w-3.5 text-blue-600" />

                <span className="text-xs font-medium text-blue-700">
                  Cost: 1 Credit
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Overlay */}
        {!hasCredits && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={() => (window.location.href = "/recruiter/billing")}
              className="
              h-9
              rounded-lg
              bg-slate-950
              px-4
              text-xs
              font-medium
              text-white
              shadow-[0_6px_20px_rgba(15,23,42,0.08)]
              hover:bg-slate-800
            "
            >
              Buy Credits
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateOptions;
