"use client";
import React from "react";
import { useUser } from "@/app/provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Plus, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

function CreditsDisplay() {
  const { user } = useUser();
  const router = useRouter();

  const handleBuyCredits = () => {
    // Navigate to pricing/buy credits page
    router.push("/recruiter/billing");
  };

  return (
    <div className="mb-4">
      <Card
        className="
        relative
        overflow-hidden
        rounded-xl
        border
        border-slate-200/70
        bg-white/90
        shadow-[0_6px_24px_rgba(15,23,42,0.04)]
      "
      >
        {/* Soft Glow */}
        <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 rounded-full bg-blue-100/40 blur-3xl" />

        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            {/* Icon */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
              <Coins className="h-4 w-4 text-blue-600" />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-sm font-semibold">Interview Credits</h2>

              <p className="mt-0.5 text-[11px] font-normal text-slate-500">
                Manage your remaining credits
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              {/* Credit Box */}
              <div
                className="
                flex
                h-20
                w-20
                flex-col
                items-center
                justify-center
                rounded-xl
                border
                border-blue-100
                bg-blue-50/70
                shadow-sm
              "
              >
                <h2 className="text-2xl font-bold text-blue-600">
                  {user?.credits || 0}
                </h2>

                <p className="mt-0.5 text-[10px] font-medium text-blue-700">
                  Credits Left
                </p>
              </div>

              {/* Info */}
              <div className="max-w-sm">
                <p className="text-xs leading-5 text-slate-600">
                  Each interview creation costs{" "}
                  <span className="font-semibold text-slate-900">1 credit</span>
                  . You can create up to{" "}
                  <span className="font-semibold text-blue-600">
                    {user?.credits || 0} more interviews
                  </span>
                  .
                </p>

                {user?.credits <= 2 && (
                  <div
                    className="
                    mt-2
                    flex
                    items-start
                    gap-2
                    rounded-lg
                    border
                    border-amber-100
                    bg-amber-50
                    px-2.5
                    py-2
                  "
                  >
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 text-amber-600" />

                    <span className="text-[11px] font-medium leading-5 text-amber-700">
                      {user?.credits === 0
                        ? "No credits remaining."
                        : user?.credits === 1
                          ? "Only 1 credit remaining."
                          : "Low credits remaining."}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Button */}
            <Button
              onClick={handleBuyCredits}
              className="
              h-9
              rounded-lg
              bg-slate-950
              px-4
              text-xs
              font-medium
              text-white
              shadow-[0_6px_20px_rgba(15,23,42,0.08)]
              transition-all
              duration-300
              hover:bg-slate-800
            "
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Buy Credits
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreditsDisplay;
