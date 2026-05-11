import {
  Calendar,
  Clock,
  MessageCircleQuestionIcon,
  Trash2,
} from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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

function InterviewDetailContainer({ interviewDetail }) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const parsedQuestions = (() => {
    const raw = interviewDetail?.questionlist;

    try {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed?.interviewQuestions))
        return parsed.interviewQuestions;
      return [];
    } catch {
      return [];
    }
  })();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // Delete interview results first (if any)
      const { error: resultsError } = await supabase
        .from("interview_results")
        .delete()
        .eq("interview_id", interviewDetail.interview_id);

      if (resultsError) {
        console.error("Error deleting interview results:", resultsError);
      }

      // Delete the interview
      const { error: interviewError } = await supabase
        .from("interviews")
        .delete()
        .eq("interview_id", interviewDetail.interview_id);

      if (interviewError) {
        throw interviewError;
      }

      toast.success("Interview deleted successfully!");
      setShowDeleteAlert(false);

      // Redirect to dashboard
      router.push("/recruiter/dashboard");
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
        mt-4
        rounded-xl
        border
        border-slate-200/70
        bg-white/90
        p-4
        shadow-[0_6px_24px_rgba(15,23,42,0.04)]
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tight text-slate-900">
            {interviewDetail?.jobposition}
          </h2>

          <p className="mt-1 text-[12px] text-slate-500">
            AI-powered interview configuration and details.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDeleteAlert(true)}
          className="
            h-8
            rounded-lg
            border-red-200
            bg-white
            px-3
            text-[11px]
            font-medium
            text-red-500
            hover:bg-red-50
            hover:text-red-600
          "
        >
          <Trash2 size={13} className="mr-1.5" />
          Delete
        </Button>
      </div>

      {/* Info Cards */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 md:grid-cols-3">
        {/* Duration */}
        <div className="rounded-lg border border-slate-200/70 bg-slate-50/70 p-3">
          <h2 className="text-[11px] font-medium text-slate-500">
            Duration
          </h2>

          <h2 className="mt-1.5 flex items-center gap-2 text-[13px] font-semibold text-slate-800">
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            {interviewDetail?.duration}
          </h2>
        </div>

        {/* Created */}
        <div className="rounded-lg border border-slate-200/70 bg-slate-50/70 p-3">
          <h2 className="text-[11px] font-medium text-slate-500">
            Created On
          </h2>

          <h2 className="mt-1.5 flex items-center gap-2 text-[13px] font-semibold text-slate-800">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            {moment(interviewDetail?.created_at).format(
              "MMMM Do YYYY"
            )}
          </h2>
        </div>

        {/* Type */}
        {interviewDetail?.type && (
          <div className="rounded-lg border border-slate-200/70 bg-slate-50/70 p-3">
            <h2 className="text-[11px] font-medium text-slate-500">
              Type
            </h2>

            <h2 className="mt-1.5 flex items-center gap-2 text-[13px] font-semibold text-slate-800">
              <Clock className="h-3.5 w-3.5 text-blue-600" />
              {JSON.parse(interviewDetail?.type)[0]}
            </h2>
          </div>
        )}
      </div>

      {/* Job Description */}
      <div className="mt-5 rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm">
        <h2 className="text-[15px] font-semibold text-slate-900">
          Job Description
        </h2>

        <p className="mt-2.5 whitespace-pre-wrap text-[13px] leading-6 text-slate-600">
          {interviewDetail?.jobdescription}
        </p>
      </div>

      {/* Questions */}
      <div className="mt-5 rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm">
        <h2 className="text-[15px] font-semibold text-slate-900">
          Interview Questions
        </h2>

        <div className="mt-3 space-y-2.5">
          {parsedQuestions.map((item, index) => (
            <div
              key={index}
              className="
                flex
                items-start
                gap-3
                rounded-lg
                border
                border-slate-100
                bg-slate-50/70
                p-3
              "
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50">
                <MessageCircleQuestionIcon className="h-3.5 w-3.5 text-blue-600" />
              </div>

              <p className="flex-1 text-[13px] leading-6 text-slate-700">
                <span className="font-semibold text-slate-900">
                  {index + 1}.
                </span>{" "}
                {item?.Interviewquestion || item?.question}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Delete Dialog */}
    <AlertDialog
      open={showDeleteAlert}
      onOpenChange={setShowDeleteAlert}
    >
      <AlertDialogContent className="rounded-2xl border border-slate-200 p-5">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[17px] font-semibold text-slate-900">
            Delete Interview
          </AlertDialogTitle>

          <AlertDialogDescription className="text-[13px] leading-6 text-slate-600">
            Are you sure you want to delete the interview for{" "}
            <strong>{interviewDetail?.jobposition}</strong>?

            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>The interview link</li>

              <li>
                All candidate responses (
                {interviewDetail["interview_results"]?.length || 0}{" "}
                candidates)
              </li>

              <li>All feedback and ratings</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleting}
            className="h-9 rounded-lg text-[13px]"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="
              h-9
              rounded-lg
              bg-red-600
              text-[13px]
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

export default InterviewDetailContainer;
