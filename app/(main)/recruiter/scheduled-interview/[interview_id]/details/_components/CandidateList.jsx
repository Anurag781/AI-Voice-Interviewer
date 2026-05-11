import React, { useState, useEffect } from "react";
import moment from "moment";
import CandidateListFeedbackDialog from "./CandidateFeedbackDialog";
import exportToCSV from "@/lib/exportToCSV"; // Ensure this path is correct
import { supabase } from "@/services/supabaseClient";
import Image from "next/image";

function CandidateList({ candidateList, jobposition }) {
  const [candidatesWithPictures, setCandidatesWithPictures] = useState([]);

  const parseJson = (input) => {
    if (typeof input !== "string") return input;
    try {
      return JSON.parse(input);
    } catch (e) {
      return input;
    }
  };

  const normalizeRating = (rawRating) => {
    if (!rawRating || typeof rawRating !== "object") return null;

    const ratingKeys = [
      "TechnicalSkills",
      "Communication",
      "ProblemSolving",
      "Experience",
      "Behavioral",
      "Thinking",
    ];

    const normalized = {};
    const values = [];

    ratingKeys.forEach((key) => {
      const value = rawRating[key];
      const numericValue =
        typeof value === "string"
          ? Number(value.replace(/[^0-9.\-]+/g, ""))
          : value;

      if (typeof numericValue === "number" && !Number.isNaN(numericValue)) {
        normalized[key] = numericValue;
        values.push(numericValue);
      }
    });

    return values.length ? normalized : null;
  };

  // Function to calculate average rating (e.g., 6/10)
  const calculateRating = (candidate) => {
    const rawTranscript = candidate?.conversation_transcript;
    const parsedTranscript = parseJson(rawTranscript);
    const feedback = parsedTranscript?.feedback || parsedTranscript || {};
    const rating = normalizeRating(feedback?.rating || feedback);
    if (!rating) return "N/A";

    const values = Object.values(rating).filter(
      (val) => typeof val === "number",
    );
    if (!values.length) return "N/A";

    const average = Math.round(
      values.reduce((a, b) => a + b, 0) / values.length,
    );
    return `${average}/10`;
  };

  // Fetch candidate pictures
  useEffect(() => {
    const fetchCandidatePictures = async () => {
      if (!candidateList || candidateList.length === 0) return;

      try {
        const candidatesWithPics = await Promise.all(
          candidateList.map(async (candidate) => {
            if (!candidate?.email) return candidate;

            try {
              const { data: userData, error } = await supabase
                .from("users")
                .select("picture")
                .eq("email", candidate.email)
                .single();

              if (!error && userData?.picture) {
                return { ...candidate, picture: userData.picture };
              }
            } catch (error) {
              console.error("Error fetching candidate picture:", error);
            }

            return candidate;
          }),
        );

        setCandidatesWithPictures(candidatesWithPics);
      } catch (error) {
        console.error("Error fetching candidate pictures:", error);
        setCandidatesWithPictures(candidateList);
      }
    };

    fetchCandidatePictures();
  }, [candidateList]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Candidates ({candidateList?.length || 0})
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            View candidate performance and interview feedback.
          </p>
        </div>

        <button
          onClick={() => exportToCSV(candidateList)}
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
          Download CSV
        </button>
      </div>

      {/* Candidate List */}
      <div className="space-y-3">
        {candidatesWithPictures?.map((candidate, index) => (
          <div
            key={index}
            className="
            flex
            items-center
            justify-between
            gap-3
            rounded-xl
            border
            border-slate-200/70
            bg-white/90
            p-4
            shadow-[0_6px_24px_rgba(15,23,42,0.04)]
            transition-all
            duration-300
            hover:shadow-[0_10px_28px_rgba(15,23,42,0.06)]
          "
          >
            {/* Left */}
            <div className="flex items-center gap-3 min-w-0">
              {candidate?.picture ? (
                <Image
                  src={candidate.picture}
                  alt={candidate?.fullname || "Candidate"}
                  width={44}
                  height={44}
                  className="rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950">
                  <h2 className="text-sm font-bold text-white">
                    {candidate?.fullname?.[0]?.toUpperCase() || "?"}
                  </h2>
                </div>
              )}

              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-slate-900">
                  {candidate?.fullname || "Unnamed Candidate"}
                </h2>

                <h2 className="mt-0.5 text-xs text-slate-500">
                  Completed on{" "}
                  {moment(
                    candidate?.completed_at || candidate?.created_at,
                  ).format("MMM DD, YYYY")}
                </h2>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-50 px-3 py-1.5 border border-green-100">
                <h2 className="text-sm font-semibold text-green-600">
                  {calculateRating(candidate)}
                </h2>
              </div>

              <CandidateListFeedbackDialog
                candidate={{
                  ...candidate,
                  jobposition: jobposition,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CandidateList;
