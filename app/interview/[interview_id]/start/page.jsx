"use client";

import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Phone, Timer } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useState, useRef } from "react";
import AlertConfirmation from "./_components/AlertConfirmation";
import axios from "axios";
import TimmerComponent from "./_components/TimmerComponent";
import { getVapiClient } from "@/lib/vapiconfig";
import { supabase } from "@/services/supabaseClient";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);

  const vapi = getVapiClient();

  const [activeUser, setActiveUser] = useState(false);
  const [start, setStart] = useState(false);
  const [subtitles, setSubtitles] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const conversation = useRef(null);

  const { interview_id } = useParams();

  const router = useRouter();

  const [userProfile] = useState({
    picture: null,
    name: interviewInfo?.candidate_name || "Candidate",
  });

  // Restore interviewInfo from localStorage if missing
  useEffect(() => {
    if (!interviewInfo && typeof window !== "undefined") {
      const stored = localStorage.getItem("interviewInfo");

      if (stored) {
        try {
          const parsed = JSON.parse(stored);

          if (parsed && parsed.interview_id === interview_id) {
            // Normalize data
            const normalizedData = {
              ...parsed,

              jobposition: parsed.jobposition || parsed.jobPosition,

              questionlist: parsed.questionlist || parsed.questionList,

              useremail: parsed.useremail || parsed.userEmail,

              jobdescription: parsed.jobdescription || parsed.jobDescription,
            };

            setInterviewInfo(normalizedData);
          } else {
            localStorage.removeItem("interviewInfo");

            router.replace(`/interview/${interview_id}`);
          }
        } catch (error) {
          console.error("LOCAL STORAGE PARSE ERROR:", error);

          localStorage.removeItem("interviewInfo");

          router.replace(`/interview/${interview_id}`);
        }
      } else {
        router.replace(`/interview/${interview_id}`);
      }
    }
  }, [interviewInfo, interview_id, setInterviewInfo, router]);

  useEffect(() => {
    if (interviewInfo && !start) {
      setStart(true);
      startCall();
    }
  }, [interviewInfo, start]);

  const startCall = async () => {
    try {
      console.log("STARTING VAPI CALL...");

      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

      if (!assistantId) {
        console.error("NEXT_PUBLIC_VAPI_ASSISTANT_ID is missing");

        toast.error("Missing Vapi Assistant ID");

        return;
      }

      const jobposition = interviewInfo?.jobposition || "Unknown Position";

      const questionlist =
        interviewInfo?.questionlist?.interviewQuestions?.map(
          (question) => question?.question,
        ) || [];

      console.log("jobposition:", jobposition);

      console.log("questionlist:", questionlist);

      await vapi.start(assistantId, {
        variableValues: {
          candidate_name: interviewInfo?.candidate_name || "Candidate",

          jobposition,

          questions: questionlist.join("\n"),
        },

        metadata: {
          interview_id,

          candidate_name: interviewInfo?.candidate_name,

          jobposition,
        },
      });

      console.log("VAPI CALL STARTED");
    } catch (err) {
      console.error("VAPI START ERROR:", err);

      toast.error("Failed to start interview");
    }
  };

  useEffect(() => {
    if (!vapi) return;

    const handleMessage = (message) => {
      console.log("VAPI MESSAGE:", message);

      // Assistant subtitles
      if (message?.role === "assistant" && message?.content) {
        setSubtitles(message.content);
      }

      // Initialize conversation array
      if (!conversation.current) {
        conversation.current = [];
      }

      // Save transcript messages
      if (message?.type === "transcript" || message?.transcript) {
        const transcriptData = {
          role: message?.role || "assistant",

          content: message?.transcript || message?.content || "",
        };

        conversation.current.push(transcriptData);

        console.log("UPDATED CONVERSATION:", conversation.current);
      }
    };

    const handleSpeechStart = () => {
      setIsSpeaking(true);
      setActiveUser(false);

      toast("AI is speaking...");
    };

    const handleSpeechEnd = () => {
      setIsSpeaking(false);
      setActiveUser(true);
    };

    const handleCallStart = () => {
      toast("Call started...");
      setStart(true);
    };

    const handleCallEnd = () => {
      toast("Call has ended. Generating feedback...");

      setIsGeneratingFeedback(true);

      GenerateFeedback();
    };

    vapi.on("message", handleMessage);

    vapi.on("call-start", handleCallStart);

    vapi.on("speech-start", handleSpeechStart);

    vapi.on("speech-end", handleSpeechEnd);

    vapi.on("call-end", handleCallEnd);

    return () => {
      vapi.off("message", handleMessage);

      vapi.off("call-start", handleCallStart);

      vapi.off("speech-start", handleSpeechStart);

      vapi.off("speech-end", handleSpeechEnd);

      vapi.off("call-end", handleCallEnd);
    };
  }, [vapi]);

  const GenerateFeedback = async () => {
    if (
      !interviewInfo ||
      !conversation.current ||
      conversation.current.length === 0
    ) {
      toast.error("Interview data missing. Please restart the interview.");

      router.replace(`/interview/${interview_id}`);

      return;
    }

    try {
      const result = await axios.post("/api/ai-feedback", {
        conversation: JSON.stringify(conversation.current, null, 2),
      });

      console.log("FULL API RESPONSE:", result.data);

      const Content = (result?.data?.result || result?.data?.content || "")
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      if (!Content) {
        throw new Error("Feedback content is empty");
      }

      console.log("Cleaned Content:", Content);

      let parsedTranscript;

      try {
        parsedTranscript = JSON.parse(Content);
      } catch (e) {
        console.error("Invalid JSON:", Content);

        throw new Error("Could not parse AI feedback JSON");
      }

      const { error: insertError } = await supabase
        .from("interview_results")
        .insert([
          {
            fullname: interviewInfo?.candidate_name,

            email: interviewInfo?.useremail,

            interview_id: interview_id,

            conversation_transcript: parsedTranscript,

            recommendations: "Not recommended",

            completed_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        console.error("SUPABASE INSERT ERROR:", insertError);

        throw new Error("Insert failed");
      }

      // Generate new questions for next candidate
      try {
        const aiResult = await axios.post("/api/ai-model", {
          jobPosition: interviewInfo?.jobposition,

          jobDescription: interviewInfo?.jobdescription,

          duration: interviewInfo?.duration,

          type: interviewInfo?.type,
        });

        const rawContent = aiResult?.data?.content || aiResult?.data?.Content;

        let newQuestions = null;

        if (rawContent) {
          const match = rawContent.match(/```json\s*([\s\S]*?)\s*```/);

          if (match && match[1]) {
            newQuestions = JSON.parse(match[1].trim());
          }
        }

        if (newQuestions) {
          await supabase
            .from("interviews")
            .update({
              questionlist: newQuestions,
            })
            .eq("interview_id", interview_id);
        }
      } catch (e) {
        console.error("FAILED TO UPDATE QUESTIONS:", e);
      }

      toast.success("Feedback generated successfully!");

      if (typeof window !== "undefined") {
        localStorage.removeItem("interviewInfo");
      }

      router.replace(
        "/interview/" + interviewInfo?.interview_id + "/completed",
      );
    } catch (error) {
      console.error("FEEDBACK GENERATION FAILED:", error);

      toast.error("Failed to generate feedback");
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const stopInterview = () => {
    vapi.stop();
  };

  if (!interviewInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium">Loading interview...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom_right,#f8fafc,white,#f1f5f9)] p-4 sm:p-5">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
              {interviewInfo?.jobposition || "AI"} Interview Session
            </h1>

            <p className="mt-1 text-[13px] text-slate-500">
              Powered by AI Interview Assistant
            </p>
          </div>

          <div
            className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-slate-200/70
            bg-white/95
            px-4
            py-2.5
            shadow-[0_4px_18px_rgba(15,23,42,0.04)]
          "
          >
            <Timer className="h-4 w-4 text-blue-600" />

            <span className="font-mono text-[15px] font-semibold text-slate-700">
              <TimmerComponent start={start} />
            </span>
          </div>
        </header>

        {/* Interview Panels */}
        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* AI Panel */}
          <div
            className={`
            rounded-2xl
            border
            bg-white/95
            p-6
            shadow-[0_8px_30px_rgba(15,23,42,0.04)]
            transition-all
            duration-300
            ${
              isSpeaking
                ? "border-blue-200 ring-4 ring-blue-50"
                : "border-slate-200/70"
            }
          `}
          >
            <div className="flex h-full flex-col items-center justify-center space-y-4">
              <div className="relative">
                {isSpeaking && (
                  <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-70"></div>
                )}

                <div
                  className="
                  relative
                  z-10
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  border-4
                  border-white
                  bg-blue-50
                  shadow-md
                "
                >
                  <Image
                    src="/AIR.png"
                    alt="AI Recruiter"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-[17px] font-semibold text-slate-800">
                  AI Recruiter
                </h2>

                <p className="mt-1 text-[13px] text-slate-500">Interview HR</p>
              </div>
            </div>
          </div>

          {/* Candidate Panel */}
          <div
            className={`
            rounded-2xl
            border
            bg-white/95
            p-6
            shadow-[0_8px_30px_rgba(15,23,42,0.04)]
            transition-all
            duration-300
            ${
              activeUser
                ? "border-purple-200 ring-4 ring-purple-50"
                : "border-slate-200/70"
            }
          `}
          >
            <div className="flex h-full flex-col items-center justify-center space-y-4">
              <div className="relative">
                {activeUser && (
                  <div className="absolute inset-0 rounded-full bg-purple-100 animate-ping opacity-70"></div>
                )}

                <div
                  className="
                  relative
                  z-10
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  border-4
                  border-white
                  bg-slate-100
                  shadow-md
                "
                >
                  {userProfile.picture ? (
                    <Image
                      src={userProfile.picture}
                      alt={userProfile.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                      priority
                    />
                  ) : (
                    <span className="text-2xl font-semibold text-slate-600">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-[17px] font-semibold text-slate-800">
                  {userProfile.name}
                </h2>

                <p className="mt-1 text-[13px] text-slate-500">Candidate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subtitles */}
        <div
          className="
          mb-5
          rounded-xl
          border
          border-slate-200/70
          bg-white/95
          p-4
          shadow-[0_4px_18px_rgba(15,23,42,0.04)]
        "
        >
          <div className="flex min-h-[64px] items-center justify-center">
            {subtitles ? (
              <p className="animate-fadeIn text-center text-[14px] leading-7 text-slate-700">
                "{subtitles}"
              </p>
            ) : (
              <p className="text-center text-[13px] text-slate-400">
                {isSpeaking ? "AI is speaking..." : "Waiting for response..."}
              </p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div
          className="
          rounded-2xl
          border
          border-slate-200/70
          bg-white/95
          p-5
          shadow-[0_6px_24px_rgba(15,23,42,0.04)]
        "
        >
          <div className="flex flex-col items-center">
            <div className="mb-4 flex gap-4">
              <AlertConfirmation stopInterview={stopInterview}>
                <button
                  className="
                  flex
                  h-11
                  items-center
                  gap-2
                  rounded-xl
                  bg-red-500
                  px-5
                  text-sm
                  font-medium
                  text-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:bg-red-600
                "
                  aria-label="End call"
                >
                  <Phone size={18} />
                  <span>End Interview</span>
                </button>
              </AlertConfirmation>
            </div>

            <p className="text-[13px] text-slate-500">
              {activeUser ? "Please respond..." : "AI is speaking..."}
            </p>
          </div>
        </div>
      </div>

      {isGeneratingFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm">
          <div
            className="
            w-full
            max-w-sm
            rounded-2xl
            border
            border-slate-200/70
            bg-white
            p-7
            text-center
            shadow-[0_14px_40px_rgba(15,23,42,0.12)]
          "
          >
            <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-b-2 border-blue-500"></div>

            <h2 className="mb-2 text-[20px] font-semibold text-slate-800">
              Generating Feedback
            </h2>

            <p className="text-[13px] leading-6 text-slate-500">
              Please wait while we analyze your interview...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StartInterview;
