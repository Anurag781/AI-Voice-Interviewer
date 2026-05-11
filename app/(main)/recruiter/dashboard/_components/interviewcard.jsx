import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Send, Trash2 } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { supabase } from "@/services/supabaseClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function InterviewCard({ interview, viewDetail = false, onDelete }) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getInterviewUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_HOST_URL.replace(/\/$/, "");
    return `${baseUrl}/interview/${interview?.interview_id}`;
  };

  const copyLink = async () => {
    try {
      const url = getInterviewUrl();
      await navigator.clipboard.writeText(url);
      toast.success("Interview link copied!");
    } catch (err) {
      toast.error("Failed to copy link");
      console.error("Failed to copy: ", err);
    }
  };

  const onSend = () => {
    const interviewUrl = getInterviewUrl();

    const subject = encodeURIComponent("AI Recruiter Interview Invitation");

    const body = encodeURIComponent(
      `Hi,

Please complete your interview using the link below:

${interviewUrl}

Best Regards`,
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;

    window.open(gmailUrl, "_blank");

    toast.success("Opening Gmail...");
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // Delete interview results first (if any)
      const { error: resultsError } = await supabase
        .from("interview_results")
        .delete()
        .eq("interview_id", interview.interview_id);

      if (resultsError) {
        console.error("Error deleting interview results:", resultsError);
      }

      // Delete the interview
      const { error: interviewError } = await supabase
        .from("interviews")
        .delete()
        .eq("interview_id", interview.interview_id);

      if (interviewError) {
        throw interviewError;
      }

      toast.success("Interview deleted successfully!");
      setShowDeleteAlert(false);

      // Call the onDelete callback to refresh the list
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete interview. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div
        className="
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
        hover:-translate-y-0.5
        hover:shadow-[0_10px_30px_rgba(15,23,42,0.06)]
        dark:border-gray-700
        dark:bg-gray-800
      "
      >
        {/* Soft Glow */}
        <div className="pointer-events-none absolute top-0 right-0 h-20 w-20 rounded-full bg-blue-100/40 blur-3xl" />

        {/* Header */}
        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {/* Left */}
          <div className="flex min-w-0 items-start gap-2.5">
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 text-sm font-semibold leading-5 tracking-tight text-slate-900 dark:text-white">
                {interview?.jobposition}
              </h2>

              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-gray-300">
                <span>
                  {moment(interview?.created_at).format("DD MMM YYYY")}
                </span>

                <span>•</span>

                <span>{interview?.duration}</span>

                <span
                  className="
                  rounded-full
                  border
                  border-slate-200
                  bg-slate-100
                  px-2
                  py-0.5
                  font-medium
                  text-slate-700
                  dark:border-gray-600
                  dark:bg-gray-700
                  dark:text-gray-200
                "
                >
                  {interview["interview_results"]?.length || 0} candidate
                  {interview["interview_results"]?.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1.5">
            <span
              className="
              rounded-full
              border
              border-blue-100
              bg-blue-50
              px-2.5
              py-1
              text-[10px]
              font-medium
              text-blue-700
              dark:border-blue-800
              dark:bg-blue-900/20
              dark:text-blue-300
            "
            >
              Scheduled
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteAlert(true)}
              className="
              h-8
              w-8
              rounded-lg
              p-0
              text-red-500
              hover:bg-red-50
              hover:text-red-600
              dark:hover:bg-red-900/20
            "
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>

        {/* Actions */}
        {!viewDetail ? (
          <div className="relative z-10 mt-4 flex flex-col gap-2 sm:flex-row">
            {/* Copy */}
            <Button
              variant="outline"
              className="
              h-9
              flex-1
              rounded-lg
              border-slate-200
              bg-white
              text-xs
              text-slate-700
              hover:bg-slate-50
              dark:border-gray-600
              dark:bg-gray-800
              dark:text-gray-200
              dark:hover:bg-gray-700
            "
              onClick={copyLink}
            >
              <Copy className="mr-1.5 h-3.5 w-3.5" />
              Copy Link
            </Button>

            {/* Send */}
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
                "AI Recruiter Interview Invitation",
              )}&body=${encodeURIComponent(`Hi,

Please complete your interview using the link below:

${getInterviewUrl()}

Best Regards`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
              h-9
              flex-1
              rounded-lg
              bg-slate-950
              text-xs
              text-white
              shadow-[0_6px_20px_rgba(15,23,42,0.08)]
              transition-all
              duration-300
              hover:bg-slate-800
              dark:bg-blue-700
              dark:hover:bg-blue-800
              flex
              items-center
              justify-center"
            >
              <Send className="mr-1.5 h-3.5 w-3.5" />
              Send Invite
            </a>
          </div>
        ) : (
          <Link
            href={`/recruiter/scheduled-interview/${interview?.interview_id}/details`}
            passHref
            legacyBehavior
          >
            <Button
              as="a"
              variant="outline"
              className="
              mt-4
              h-9
              w-full
              rounded-lg
              border-slate-200
              bg-white
              text-xs
              text-slate-700
              hover:bg-slate-50
              dark:border-gray-600
              dark:bg-gray-800
              dark:text-gray-200
              dark:hover:bg-gray-700
            "
            >
              View Details
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        )}
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="rounded-xl border border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-slate-900">
              Delete Interview
            </AlertDialogTitle>

            <AlertDialogDescription asChild>
              <div className="text-sm leading-6 text-slate-600">
                Are you sure you want to delete{" "}
                <strong>{interview?.jobposition}</strong>?
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>The interview link</li>

                  <li>
                    All candidate responses (
                    {interview?.interview_results?.length || 0} candidates)
                  </li>

                  <li>All feedback and ratings</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="rounded-lg">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="
              rounded-lg
              bg-red-600
              text-white
              hover:bg-red-700
            "
            >
              {deleting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                "Delete Interview"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default InterviewCard;
