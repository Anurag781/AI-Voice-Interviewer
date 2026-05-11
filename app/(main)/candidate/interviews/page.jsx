"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
} from "lucide-react";
import moment from "moment";
import { toast } from "sonner";

export default function Candidateinterviews() {
  const { user } = useUser();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchCandidateInterviews();
    }
  }, [user]);

  const fetchCandidateInterviews = async () => {
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
            created_at,
            useremail
          )
        `,
        )
        .eq("email", user.email)
        .order("completed_at", { ascending: false });

      if (error) {
        console.error("Error fetching interviews:", error);
        toast.error("Failed to load interviews");
        return;
      }

      setInterviews(data || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load interviews");
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

    // if rating itself is number
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
    if (score === "N/A") return "bg-gray-100 text-gray-600";

    const numScore = parseInt(score);

    if (numScore >= 8) return "bg-green-100 text-green-700";
    if (numScore >= 6) return "bg-yellow-100 text-yellow-700";

    return "bg-red-100 text-red-700";
  };

  const getStatusIcon = () => {
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading your interviews...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[21px] font-semibold text-slate-900">
          My Interviews
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Track your interview sessions and performance insights.
        </p>
      </div>

      {interviews.length === 0 ? (
        <Card
          className="
          rounded-2xl
          border
          border-slate-200/70
          bg-white/95
          shadow-[0_10px_40px_rgba(15,23,42,0.04)]
        "
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div
              className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-slate-100
            "
            >
              <Video className="h-6 w-6 text-slate-400" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-900">
              No interviews yet
            </h3>

            <p className="mt-1 text-center text-sm text-slate-500">
              You haven&apos;t participated in any interviews yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5">
          {interviews.map((result) => {
            const score = calculateOverallScore(result.conversation_transcript);

            const feedback = parseFeedback(result.conversation_transcript);

            return (
              <Card
                key={result.id}
                className="
                rounded-2xl
                border
                border-slate-200/70
                bg-white/95
                shadow-[0_10px_40px_rgba(15,23,42,0.04)]
                transition-all
                duration-300
                hover:shadow-[0_14px_50px_rgba(15,23,42,0.07)]
              "
              >
                {/* Header */}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex items-center gap-3">
                        <div
                          className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          bg-blue-50
                          ring-1
                          ring-blue-100
                        "
                        >
                          <Video className="h-4.5 w-4.5 text-blue-600" />
                        </div>

                        <div>
                          <CardTitle className="truncate text-[16px] font-semibold text-slate-900">
                            {result.interviews?.jobposition || "Interview"}
                          </CardTitle>

                          <p className="mt-0.5 text-[13px] text-slate-500">
                            AI Interview Session
                          </p>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-3 text-[13px] text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />

                          {moment(result.completed_at).format("MMM DD, YYYY")}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />

                          {result.interviews?.duration || "N/A"}
                        </div>

                        <Badge
                          variant="outline"
                          className="
                          rounded-lg
                          border-slate-200
                          bg-white
                          px-2
                          py-0.5
                          text-[11px]
                          font-medium
                          text-slate-600
                        "
                        >
                          {Array.isArray(result.interviews?.type)
                            ? result.interviews.type
                                .map((t) => t.replace(/"/g, ""))
                                .join(", ")
                            : result.interviews?.type?.replace(
                                /[\[\]"]/g,
                                "",
                              ) || "Interview"}
                        </Badge>
                      </div>
                    </div>

                    {/* Status */}
                    <div
                      className="
                      flex
                      items-center
                      gap-1.5
                      rounded-lg
                      bg-green-50
                      px-2.5
                      py-1.5
                      text-green-700
                    "
                    >
                      {getStatusIcon()}

                      <span className="text-[11px] font-medium">Completed</span>
                    </div>
                  </div>
                </CardHeader>

                {/* Content */}
                <CardContent className="space-y-4">
                  {/* Job Description */}
                  <div
                    className="
                    rounded-xl
                    border
                    border-slate-200/70
                    bg-slate-50/60
                    p-3.5
                  "
                  >
                    <h3 className="mb-1.5 text-[13px] font-semibold text-slate-800">
                      Job Description
                    </h3>

                    <p className="line-clamp-3 text-[13px] leading-6 text-slate-600">
                      {result.interviews?.jobdescription ||
                        "No description available"}
                    </p>
                  </div>

                  {/* Score + Recommendation */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {/* Score */}
                    <div
                      className="
                      rounded-xl
                      border
                      border-slate-200/70
                      bg-white
                      p-3.5
                    "
                    >
                      <h3 className="mb-2 text-[13px] font-semibold text-slate-800">
                        Overall Score
                      </h3>

                      <Badge
                        className={`
                        rounded-lg
                        border
                        px-2.5
                        py-1
                        text-[11px]
                        font-medium
                        ${getScoreColor(score)}
                      `}
                      >
                        {score}
                      </Badge>
                    </div>

                    {/* Recommendation */}
                    <div
                      className="
                      rounded-xl
                      border
                      border-slate-200/70
                      bg-white
                      p-3.5
                    "
                    >
                      <h3 className="mb-2 text-[13px] font-semibold text-slate-800">
                        Recommendation
                      </h3>

                      <p className="text-[13px] font-medium text-slate-700">
                        {result.recommendations ||
                          feedback?.recommendation ||
                          "Pending"}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-slate-100 pt-3 text-center">
                    <p className="text-[13px] text-slate-500">
                      The recruiter will contact you regarding the next steps.
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
