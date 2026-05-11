"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Video, Calendar, Star, CheckCircle, Clock } from "lucide-react";

import moment from "moment";
import Link from "next/link";

export default function Recentinterviews() {
  const { user } = useUser();

  const [recentinterviews, setRecentinterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchRecentinterviews();
    }
  }, [user]);

  const fetchRecentinterviews = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("interview_results")
        .select(
          `
          *,
          interviews (
            jobposition,
            jobdescription,
            type,
            duration,
            created_at
          )
        `,
        )
        .eq("email", user.email)
        .order("completed_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching recent interviews:", error);
        return;
      }

      setRecentinterviews(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseFeedback = (conversationTranscript) => {
    try {
      if (!conversationTranscript) return null;

      const parsed =
        typeof conversationTranscript === "string"
          ? JSON.parse(conversationTranscript)
          : conversationTranscript;

      return parsed?.feedback || parsed;
    } catch (error) {
      return null;
    }
  };

  const calculateOverallScore = (conversationTranscript) => {
    const feedback = parseFeedback(conversationTranscript);

    if (!feedback?.rating) return "N/A";

    // if rating is single number
    if (typeof feedback.rating === "number") {
      return `${feedback.rating}/10`;
    }

    // if rating is object
    const ratings = Object.values(feedback.rating).filter(
      (val) => typeof val === "number",
    );

    if (ratings.length === 0) return "N/A";

    const average = Math.round(
      ratings.reduce((a, b) => a + b, 0) / ratings.length,
    );

    return `${average}/10`;
  };

  const getScoreColor = (score) => {
    if (score === "N/A") {
      return "bg-gray-100 text-gray-600 border-gray-200";
    }

    const numScore = parseInt(score);

    if (numScore >= 8) {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (numScore >= 6) {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }

    return "bg-red-100 text-red-700 border-red-200";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Recent Interviews
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>

            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="
      rounded-3xl
      border
      border-slate-200/70
      bg-white/95
      shadow-[0_14px_50px_rgba(15,23,42,0.05)]
    "
    >
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div
              className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              bg-blue-50
              ring-1
              ring-blue-100
            "
            >
              <Video className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h2 className="text-[18px] font-semibold text-slate-900">
                Recent Interviews
              </h2>

              <p className="text-sm text-slate-500 font-normal mt-0.5">
                Track your latest AI interview activity
              </p>
            </div>
          </CardTitle>

          {recentinterviews.length > 0 && (
            <Link href="/candidate/interviews">
              <Button
                variant="outline"
                size="sm"
                className="
                h-10
                rounded-xl
                border-slate-200
                bg-white
                px-4
                text-sm
                font-medium
                text-slate-700
                hover:bg-slate-50
                hover:border-slate-300
              "
              >
                View All
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {recentinterviews.length === 0 ? (
          <div className="py-12 text-center">
            <div
              className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-slate-100
            "
            >
              <Video className="h-7 w-7 text-slate-400" />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-700">
              No interviews yet
            </p>

            <p className="mt-1 text-[13px] text-slate-500">
              Your interview history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentinterviews.map((result) => {
              const score = calculateOverallScore(
                result.conversation_transcript,
              );

              return (
                <div
                  key={result.id}
                  className="
                  group
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-slate-200/70
                  bg-slate-50/70
                  p-4
                  transition-all
                  duration-300
                  hover:border-slate-300
                  hover:bg-white
                "
                >
                  {/* Left Side */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h4 className="truncate text-[15px] font-semibold text-slate-900">
                        {result.interviews?.jobposition || "Interview"}
                      </h4>

                      <Badge
                        variant="outline"
                        className="
                        rounded-lg
                        border-slate-200
                        bg-white
                        px-2.5
                        py-0.5
                        text-[11px]
                        font-medium
                        text-slate-600
                      "
                      >
                        {Array.isArray(result.interviews?.type)
                          ? result.interviews.type.join(", ")
                          : result.interviews?.type?.replace(/[\[\]"]/g, "") ||
                            "Interview"}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[12px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />

                        {moment(result.completed_at).format("MMM DD, YYYY")}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />

                        {result.interviews?.duration
                          ? `${result.interviews.duration} Minutes`
                          : "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="ml-4 flex items-center gap-3">
                    <div
                      className="
                      hidden
                      items-center
                      gap-1.5
                      rounded-xl
                      bg-green-50
                      px-3
                      py-1.5
                      text-green-700
                      sm:flex
                    "
                    >
                      <CheckCircle className="h-4 w-4" />

                      <span className="text-xs font-medium">Completed</span>
                    </div>

                    {score !== "N/A" && (
                      <Badge
                        className={`
                        rounded-xl
                        border
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        ${getScoreColor(score)}
                      `}
                      >
                        <Star className="mr-1 h-3.5 w-3.5" />

                        {score}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
