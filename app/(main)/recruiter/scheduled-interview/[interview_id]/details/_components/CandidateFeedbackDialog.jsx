import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { Download } from "lucide-react";
import Image from "next/image";

function CandidateFeedbackDialog({ candidate }) {
  const [downloadingCV, setDownloadingCV] = useState(false);
  const [cvAvailable, setCvAvailable] = useState(false);
  const [cvFilePath, setCvFilePath] = useState(null);
  const [candidatePicture, setCandidatePicture] = useState(null);

  const parseJson = (input) => {
    if (typeof input !== "string") return input;
    try {
      return JSON.parse(input);
    } catch (e) {
      return input;
    }
  };

  const normalizeRating = (rawRating) => {
    const defaultRating = {
      TechnicalSkills: 0,
      Communication: 0,
      ProblemSolving: 0,
      Experience: 0,
      Behavioral: 0,
      Thinking: 0,
    };

    if (!rawRating || typeof rawRating !== "object") {
      return defaultRating;
    }

    const ratingKeys = [
      "TechnicalSkills",
      "Communication",
      "ProblemSolving",
      "Experience",
      "Behavioral",
      "Thinking",
    ];

    const normalized = { ...defaultRating };
    let hasValidValue = false;

    ratingKeys.forEach((key) => {
      const value = rawRating[key];
      const numericValue =
        typeof value === "string"
          ? Number(value.replace(/[^0-9.\-]+/g, ""))
          : value;

      if (typeof numericValue === "number" && !Number.isNaN(numericValue)) {
        normalized[key] = numericValue;
        hasValidValue = true;
      }
    });

    return hasValidValue ? normalized : defaultRating;
  };

  const rawTranscript = candidate?.conversation_transcript;
  const parsedTranscript = parseJson(rawTranscript);
  const feedback = parsedTranscript?.feedback || parsedTranscript || {};
  const conversation_transcript = parsedTranscript || {};

  const rating = normalizeRating(feedback?.rating || feedback);

  const recommendationText =
    feedback?.Recommendation || feedback?.recommendation || "";

  const recommendationMessage =
    feedback?.RecommendationMessage ||
    feedback?.recommendationMessage ||
    feedback?.["Recommendation Message"] ||
    "No recommendation message provided";

  const summaryText = feedback?.summery || feedback?.summary || "";
  const summaryArray = Array.isArray(summaryText)
    ? summaryText
    : typeof summaryText === "string"
      ? summaryText.split("\n").filter((line) => line.trim())
      : [];

  const ratings = Object.values(rating).filter(
    (val) => typeof val === "number",
  );
  const overallScore =
    ratings.length > 0
      ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length)
      : 0;

  const isRecommended = !recommendationText.toLowerCase().includes("not");

  const getQualitativeFeedback = (score) => {
    if (score >= 8) return "Good";
    if (score >= 5) return "Needs Improvement";
    return "Bad";
  };

  // Function to fetch candidate's CV information
  const fetchCandidateCV = async () => {
    if (!candidate?.email) return;

    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("cv_file_path, picture")
        .eq("email", candidate.email)
        .limit(1);

      if (error) {
        console.log("SUPABASE FULL ERROR");
        console.log(JSON.stringify(error, null, 2));
        return;
      }

      const user = userData?.[0];

      if (!user) {
        console.log("No candidate profile found");
        return;
      }

      console.log("Fetched user:", user);

      // FIXED CV PATH
      if (user.cv_file_path) {
        console.log("CV Path:", user.cv_file_path);

        setCvFilePath(user.cv_file_path);

        setCvAvailable(true);
      } else {
        setCvAvailable(false);
      }

      // Profile Picture
      if (user.picture) {
        setCandidatePicture(user.picture);
      }
    } catch (error) {
      console.error("Error fetching CV info:", error);
    }
  };

  // Function to download CV
  const downloadCV = async () => {
    if (!cvFilePath) {
      toast.error("CV not available");
      return;
    }

    console.log("Trying to download:", cvFilePath);

    setDownloadingCV(true);

    try {
      console.log("Downloading CV:", cvFilePath);

      const { data, error } = await supabase.storage
        .from("cv-uploads")
        .download(cvFilePath);

      if (error) {
        throw error;
      }

      // Create a blob URL and trigger download
      const blob = new Blob([data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${candidate?.fullname || "candidate"}_CV.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success("CV downloaded successfully!");
    } catch (error) {
      console.error("Error downloading CV:", error);

      toast.error("Failed to download CV");
    } finally {
      setDownloadingCV(false);
    }
  };

  // Fetch CV info when dialog opens
  React.useEffect(() => {
    if (candidate?.email) {
      fetchCandidateCV();
    }
  }, [candidate?.email]);

  const emailTemplates = {
    selected: `Subject: Congratulations! You've been selected for further evaluation

Dear ${candidate?.fullname || "Candidate"},

We're pleased to inform you that based on your recent interview performance, you've been selected to move forward in our hiring process for the ${candidate?.jobposition || "the position"} role.

Your performance in the key areas is summarized below:
${Object.entries(rating)
  .map(
    ([skill, score]) =>
      `- ${skill.replace(/([A-Z])/g, " $1").trim()}: ${getQualitativeFeedback(score)}`,
  )
  .join("\n")}

Our team will be in touch shortly to schedule the next phase. In the meantime, feel free to reply to this email with any questions.

Congratulations again!

Best regards,
${candidate?.fullname || "Candidate"}
${candidate?.email || "No Email"}`,

    rejected: `Subject: Update on Your Application for ${candidate?.jobposition || "the position"}

Dear ${candidate?.fullname || "Candidate"},

Thank you for taking the time to interview with us for the ${candidate?.jobposition || "the position"} position. We appreciate the effort you put into the process.

Your performance in the key areas is summarized below:
${Object.entries(rating)
  .map(
    ([skill, score]) =>
      `- ${skill.replace(/([A-Z])/g, " $1").trim()}: ${getQualitativeFeedback(score)}`,
  )
  .join("\n")}

After careful consideration, we've decided to move forward with other candidates whose skills and experience more closely match our current needs.

We wish you the best in your job search and professional endeavors.

Best regards,
${candidate?.fullname || "Candidate"}
${candidate?.email || "No Email"}`,

    reevaluate: `Subject: Request for Additional Evaluation for ${candidate?.jobposition || "the position"}

Dear ${candidate?.fullname || "Candidate"},

Thank you for your recent interview for the ${candidate?.jobposition || "the position"} role. While we found several strengths in your application, we'd like to gather some additional information before making a final decision.

Your performance in the key areas is summarized below:
${Object.entries(rating)
  .map(
    ([skill, score]) =>
      `- ${skill.replace(/([A-Z])/g, " $1").trim()}: ${getQualitativeFeedback(score)}`,
  )
  .join("\n")}

Would you be available for a conversation at your earliest convenience? Please reply with your availability or any questions you might have.

We appreciate your time and interest, and we look forward to continuing the conversation.

Best regards,
${candidate?.fullname || "Candidate"}
${candidate?.email || "No Email"}`,
  };

  const handleEmailAction = (templateType) => {
    const email = candidate?.email || "";

    const subject = encodeURIComponent(
      emailTemplates[templateType].split("\n")[0].replace("Subject: ", ""),
    );

    const body = encodeURIComponent(
      emailTemplates[templateType].split("\n").slice(1).join("\n"),
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

    toast.success("Opening Gmail...");

    window.open(gmailUrl, "_blank");
  };

  return (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="outline"
        className="
          h-8
          rounded-lg
          border-slate-200
          bg-white
          px-3
          text-xs
          font-medium
          text-slate-700
          transition-all
          duration-300
          hover:border-slate-300
          hover:bg-slate-50
        "
      >
        View Report
      </Button>
    </DialogTrigger>

    <DialogContent
      className="
        max-h-[92vh]
        max-w-3xl
        overflow-y-auto
        rounded-3xl
        border
        border-slate-200/70
        bg-white
        p-0
      "
    >
      <DialogHeader className="border-b border-slate-100 px-7 py-6">
        <DialogTitle className="text-[19px] font-semibold text-slate-900">
          Feedback Report
        </DialogTitle>

        <DialogDescription asChild>
          <div className="mt-5 space-y-5 px-1 pb-2">
            {/* Candidate Header */}
            <div
              className="
                flex
                flex-col
                gap-5
                rounded-2xl
                border
                border-slate-200/70
                bg-slate-50/70
                p-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div className="flex items-center gap-4">
                {candidatePicture ? (
                  <Image
                    src={candidatePicture}
                    alt={candidate?.fullname || "Candidate"}
                    width={50}
                    height={50}
                    className="rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900">
                    <h2 className="text-sm font-bold text-white">
                      {candidate?.fullname?.[0]?.toUpperCase() || "?"}
                    </h2>
                  </div>
                )}

                <div>
                  <h2 className="text-[14px] font-semibold text-slate-900">
                    {candidate?.fullname || "No Name"}
                  </h2>

                  <h2 className="text-[12px] text-slate-500">
                    {candidate?.email || "No Email"}
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="text-right">
                  <p className="text-[11px] text-slate-500">
                    Overall Score
                  </p>

                  <h2 className="text-[28px] font-bold text-blue-600">
                    {overallScore}/10
                  </h2>
                </div>

                {cvAvailable && (
                  <Button
                    onClick={downloadCV}
                    disabled={downloadingCV}
                    variant="outline"
                    size="sm"
                    className="
                      h-9
                      rounded-xl
                      border-green-200
                      bg-white
                      px-4
                      text-[12px]
                      text-green-600
                      hover:bg-green-50
                    "
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" />

                    {downloadingCV
                      ? "Downloading..."
                      : "Download CV"}
                  </Button>
                )}
              </div>
            </div>

            {/* Skills Assessment */}
            <div
              className="
                rounded-2xl
                border
                border-slate-200/70
                bg-white
                p-5
                shadow-sm
              "
            >
              <h2 className="mb-4 text-[14px] font-semibold text-slate-900">
                Skills Assessment
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-7">
                {Object.entries(rating).map(([skill, score]) => (
                  <div key={skill}>
                    <div className="mb-1.5 flex justify-between text-[12px] text-slate-600">
                      <span>
                        {skill
                          .replace(/([A-Z])/g, " $1")
                          .trim()}
                      </span>

                      <span className="font-medium">
                        {score}/10
                      </span>
                    </div>

                    <Progress
                      value={score * 10}
                      className="h-2 rounded-full bg-slate-100 [&>div]:bg-blue-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Summary */}
            <div
              className="
                rounded-2xl
                border
                border-slate-200/70
                bg-white
                p-5
                shadow-sm
              "
            >
              <h2 className="mb-4 text-[14px] font-semibold text-slate-900">
                Performance Summary
              </h2>

              <div className="rounded-xl bg-slate-50 p-4 text-[13px] leading-6 text-slate-600">
                {summaryArray.length > 0 ? (
                  summaryArray.map((line, index) => (
                    <p
                      key={index}
                      className="mb-2 last:mb-0"
                    >
                      {line}
                    </p>
                  ))
                ) : (
                  <p className="text-slate-500">
                    No summary available
                  </p>
                )}
              </div>
            </div>

            {/* Recommendation */}
            <div
              className={`rounded-2xl border p-5 shadow-sm ${
                isRecommended
                  ? "border-green-200 bg-green-50/60"
                  : "border-red-200 bg-red-50/60"
              }`}
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
                <div className="flex-1">
                  <h2
                    className={`text-[15px] font-semibold ${
                      isRecommended
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {recommendationText ||
                      "Recommendation to Hire"}
                  </h2>

                  <p className="mt-3 whitespace-pre-wrap text-[13px] leading-6 text-slate-700">
                    {recommendationMessage}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2.5 lg:w-[210px]">
                  <Button
                    onClick={() =>
                      handleEmailAction("selected")
                    }
                    variant="outline"
                    className="
                      h-9
                      rounded-xl
                      border-green-200
                      bg-white
                      text-[12px]
                      text-green-600
                      hover:bg-green-50
                    "
                  >
                    Selected
                  </Button>

                  <Button
                    onClick={() =>
                      handleEmailAction("rejected")
                    }
                    variant="outline"
                    className="
                      h-9
                      rounded-xl
                      border-red-200
                      bg-white
                      text-[12px]
                      text-red-600
                      hover:bg-red-50
                    "
                  >
                    Rejected
                  </Button>

                  <Button
                    onClick={() =>
                      handleEmailAction("reevaluate")
                    }
                    variant="outline"
                    className="
                      h-9
                      rounded-xl
                      border-yellow-200
                      bg-white
                      text-[12px]
                      text-yellow-700
                      hover:bg-yellow-50
                    "
                  >
                    Request Re-Evaluation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);
}

export default CandidateFeedbackDialog;
