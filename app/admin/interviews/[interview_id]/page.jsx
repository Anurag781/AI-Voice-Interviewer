"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  ArrowLeft,
  CheckCircle,
  XCircle,
  BarChart3,
  Clock,
} from "lucide-react";
import moment from "moment";

export default function InterviewDetailPage() {
  const router = useRouter();
  const params = useParams();
  const interviewId = params?.interview_id;
  const [interview, setInterview] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (interviewId) fetchDetails();
  }, [interviewId]);

  const fetchDetails = async () => {
    setLoading(true);
    const { data: interviewData, error: interviewError } = await supabase
      .from("interviews")
      .select("*")
      .eq("interview_id", interviewId) // <-- CORRECT
      .single();
    if (interviewError) {
      setInterview(null);
      setLoading(false);
      return;
    }
    setInterview(interviewData);
    const { data: resultsData } = await supabase
      .from("interview_results")
      .select("*")
      .eq("interview_id", interviewId);
    setResults(resultsData || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="text-center py-16">
        <XCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Interview Not Found</h2>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

return (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 space-y-5">
    {/* Header */}
    <div className="flex items-center justify-between">
      <Button
        onClick={() => router.back()}
        variant="outline"
        className="
          h-9
          rounded-xl
          border-slate-200
          bg-white
          hover:bg-slate-50
          shadow-sm
        "
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
        <BarChart3 className="w-3.5 h-3.5" />
        Interview Analytics
      </div>
    </div>

    {/* Interview Overview */}
    <Card
      className="
        rounded-3xl
        border
        border-slate-200/70
        bg-white
        shadow-sm
      "
    >
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          {/* Left */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-blue-100
                bg-blue-50
              "
            >
              <Users className="w-5 h-5 text-blue-600" />
            </div>

            <div className="min-w-0 flex-1">
              <CardTitle className="text-2xl font-bold text-slate-900 leading-tight">
                {interview.jobposition ||
                  interview.name ||
                  "Untitled Interview"}
              </CardTitle>

              <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-5 text-sm">
                <div className="flex items-center text-slate-600">
                  <Users className="w-4 h-4 mr-2 text-slate-400 shrink-0" />

                  <span className="break-all">
                    {interview.useremail ||
                      interview.email ||
                      "Unknown"}
                  </span>
                </div>

                <div className="flex items-center text-slate-500">
                  <Clock className="w-4 h-4 mr-2 text-slate-400 shrink-0" />

                  {moment(interview.created_at).format(
                    "MMM DD, YYYY • hh:mm A",
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                text-center
                min-w-[110px]
              "
            >
              <div className="text-2xl font-bold text-slate-900">
                {results.length}
              </div>

              <div className="text-[11px] text-slate-500 mt-1">
                Candidates
              </div>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-blue-100
                bg-blue-50
                px-4
                py-3
                text-center
                min-w-[110px]
              "
            >
              <div className="text-2xl font-bold text-blue-700">
                {results.length > 0
                  ? (
                      results.reduce((sum, result) => {
                        let parsedTranscript =
                          result.conversation_transcript;

                        if (typeof parsedTranscript === "string") {
                          try {
                            parsedTranscript =
                              JSON.parse(parsedTranscript);
                          } catch (e) {}
                        }

                        const feedback =
                          parsedTranscript?.feedback ||
                          parsedTranscript ||
                          {};

                        const ratings = feedback?.rating || {};

                        const ratingValues = Object.values(
                          ratings,
                        ).filter(
                          (val) => typeof val === "number",
                        );

                        const avg = ratingValues.length
                          ? ratingValues.reduce(
                              (a, b) => a + b,
                              0,
                            ) / ratingValues.length
                          : 0;

                        return sum + avg;
                      }, 0) / results.length
                    ).toFixed(1)
                  : "0"}
              </div>

              <div className="text-[11px] text-slate-500 mt-1">
                Avg Score
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div
          className="
            rounded-2xl
            border
            border-slate-200/70
            bg-slate-50/70
            p-4
          "
        >
          <div className="text-sm font-semibold text-slate-800 mb-2">
            Interview Description
          </div>

          <p className="text-sm leading-relaxed text-slate-600">
            {interview.jobdescription ||
              "No description provided."}
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 mt-4 text-xs text-slate-500">
            <span>
              <span className="font-semibold text-slate-700">
                Interview ID:
              </span>{" "}
              {interview.id}
            </span>

            <span>
              <span className="font-semibold text-slate-700">
                Total Candidates:
              </span>{" "}
              {results.length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Candidate Results */}
    <Card
      className="
        rounded-3xl
        border
        border-slate-200/70
        bg-white
        shadow-sm
      "
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-900">
          Candidate Results
        </CardTitle>

        <CardDescription>
          All candidates who participated in this interview
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {results.length === 0 ? (
          <div className="py-14 text-center">
            <Users className="w-10 h-10 mx-auto text-slate-300 mb-4" />

            <h3 className="text-base font-semibold text-slate-800">
              No Candidates Yet
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Candidate interview results will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => {
              let parsedTranscript =
                result.conversation_transcript;

              if (typeof parsedTranscript === "string") {
                try {
                  parsedTranscript =
                    JSON.parse(parsedTranscript);
                } catch (e) {
                  parsedTranscript = parsedTranscript;
                }
              }

              const feedback =
                parsedTranscript?.feedback ||
                parsedTranscript ||
                {};

              const ratings = feedback?.rating || {};

              const summary = feedback?.summary || "";

              const recommendation =
                feedback?.Recommendation ||
                feedback?.recommendation ||
                "";

              const recommendationMsg =
                feedback?.RecommendationMessage ||
                feedback?.recommendationMessage ||
                "";

              const ratingValues = Object.values(ratings).filter(
                (val) => typeof val === "number",
              );

              const avgScore = ratingValues.length
                ? (
                    ratingValues.reduce((a, b) => a + b, 0) /
                    ratingValues.length
                  ).toFixed(1)
                : "N/A";

              return (
                <div
                  key={result.id}
                  className="
                    rounded-3xl
                    border
                    border-slate-200/70
                    bg-white
                    p-4
                    shadow-sm
                    hover:shadow-md
                    transition-all
                  "
                >
                  {/* Top */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-2xl
                          border
                          border-blue-100
                          bg-blue-50
                        "
                      >
                        <span className="text-sm font-bold text-blue-700">
                          {result.fullname?.charAt(0) || "C"}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {result.fullname ||
                            "Unknown Candidate"}
                        </h3>

                        <div className="text-sm text-slate-500 mt-1 break-all">
                          {result.email || "No email"}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-3">
                          <Clock className="w-3.5 h-3.5" />

                          {result.completed_at
                            ? moment(result.completed_at).format(
                                "MMM DD, YYYY • hh:mm A",
                              )
                            : "Not completed"}
                        </div>
                      </div>
                    </div>

                    {/* Score */}
                    <div
                      className="
                        rounded-2xl
                        border
                        border-blue-100
                        bg-blue-50
                        px-5
                        py-4
                        text-center
                        min-w-[110px]
                      "
                    >
                      <div className="text-3xl font-bold text-blue-700">
                        {avgScore}
                      </div>

                      <div className="text-[11px] text-slate-500 mt-1">
                        Avg Score
                      </div>
                    </div>
                  </div>

                  {/* Ratings */}
                  {Object.keys(ratings).length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mt-5">
                      {Object.entries(ratings).map(
                        ([category, score]) => (
                          <div
                            key={category}
                            className="
                              rounded-2xl
                              border
                              border-slate-200/70
                              bg-slate-50
                              p-3
                              text-center
                            "
                          >
                            <div className="text-lg font-bold text-slate-800">
                              {score}/10
                            </div>

                            <div className="text-[11px] text-slate-500 mt-2 capitalize">
                              {category
                                .replace(/([A-Z])/g, " $1")
                                .trim()}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {/* Summary */}
                  {summary && (
                    <div className="mt-5">
                      <h4 className="font-semibold text-slate-800 mb-2">
                        Summary
                      </h4>

                      <div
                        className="
                          rounded-2xl
                          border
                          border-slate-200/70
                          bg-slate-50/70
                          p-4
                          text-sm
                          leading-relaxed
                          text-slate-600
                        "
                      >
                        {summary}
                      </div>
                    </div>
                  )}

                  {/* Recommendation */}
                  {recommendation && (
                    <div className="mt-5">
                      <h4 className="font-semibold text-slate-800 mb-3">
                        Recommendation
                      </h4>

                      <div
                        className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
                          recommendation
                            .toLowerCase()
                            .includes("recommended")
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {recommendation}
                      </div>

                      {recommendationMsg && (
                        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                          {recommendationMsg}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);
}
