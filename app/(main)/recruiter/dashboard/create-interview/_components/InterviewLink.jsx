import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  Linkedin,
  List,
  Mail,
  Plus,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const InterviewLink = ({ interview_id, formData }) => {
  const router = useRouter();

  // Get clean base URL (remove trailing slash if present)
  const baseUrl = (
    process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  // Construct full interview URL
  const url = `${baseUrl}/interview/${interview_id}`;

  const getInterviewURL = () => {
    return url;
  };

  const expiresAt = () => {
    const createdDate = formData?.created_at
      ? new Date(formData.created_at)
      : new Date();

    const futureDate = new Date(createdDate);

    // Add 30 days
    futureDate.setDate(futureDate.getDate() + 30);

    return futureDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast.success("Interview link copied!");
  };

  const shareVia = (platform) => {
    const interviewTitle = formData?.title || "AI Interview";

    const defaultMessage = `Join my ${interviewTitle} interview:
${url}`;

    const emailSubject = `Invitation to ${interviewTitle}`;

    const emailBody = `Dear Candidate,

I hope this message finds you well.

You are invited to participate in the ${interviewTitle}.

Interview Link:
${url}

Please complete the interview before the deadline.

Best regards`;

    switch (platform) {
      case "email":
        window.open(
          `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
            emailSubject,
          )}&body=${encodeURIComponent(emailBody)}`,
          "_blank",
        );
        break;

      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url,
          )}`,
          "_blank",
        );
        break;

      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(defaultMessage)}`,
          "_blank",
        );
        break;

      default:
        break;
    }

    // Track sharing event if analytics are set up
    //analytics.track("Interview Shared", { platform, interview_id });
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Success Header */}
      <div className="flex flex-col items-center text-center">
        <div
          className="
        flex
        h-16
        w-16
        items-center
        justify-center
        rounded-2xl
        border
        border-green-100
        bg-green-50
        shadow-sm
      "
        >
          <Image
            src={"/tick3.png"}
            alt="success_icon"
            width={34}
            height={34}
            className="object-contain"
          />
        </div>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Your AI Interview is Ready!
        </h2>

        <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
          Share the interview link with candidates and start your AI-powered
          hiring process instantly.
        </p>
      </div>

      {/* Interview Link Card */}
      <div
        className="
      relative
      w-full
      overflow-hidden
      rounded-2xl
      border
      border-slate-200/70
      bg-white/90
      p-6
      shadow-[0_8px_30px_rgba(15,23,42,0.04)]
    "
      >
        {/* Glow */}
        <div className="pointer-events-none absolute top-0 right-0 h-28 w-28 rounded-full bg-blue-100/40 blur-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Interview Link
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                This interview link will remain active for 30 days.
              </p>
            </div>

            <div
              className="
            rounded-full
            border
            border-blue-100
            bg-blue-50
            px-3
            py-1
            text-[11px]
            font-medium
            text-blue-700
          "
            >
              Valid for 30 Days
            </div>
          </div>

          {/* URL Input */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Input
              value={getInterviewURL()}
              readOnly
              className="
            h-11
            rounded-xl
            border-slate-200
            bg-slate-50
            text-sm
          "
            />

            <Button
              onClick={onCopyLink}
              className="
            h-11
            rounded-xl
            bg-slate-950
            px-5
            text-sm
            text-white
            hover:bg-slate-800
          "
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </div>

          {/* Info */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div
              className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-slate-200
            bg-slate-50/70
            px-4
            py-3
          "
            >
              <Clock className="h-4 w-4 text-blue-600" />

              <div>
                <p className="text-[11px] text-slate-500">Duration</p>
                <h2 className="text-sm font-semibold text-slate-900">
                  {formData.duration || "30 min"}
                </h2>
              </div>
            </div>

            <div
              className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-slate-200
            bg-slate-50/70
            px-4
            py-3
          "
            >
              <List className="h-4 w-4 text-blue-600" />

              <div>
                <p className="text-[11px] text-slate-500">Questions</p>
                <h2 className="text-sm font-semibold text-slate-900">
                  {formData?.questList?.length || "10"} Questions
                </h2>
              </div>
            </div>

            <div
              className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-slate-200
            bg-slate-50/70
            px-4
            py-3
          "
            >
              <Calendar className="h-4 w-4 text-blue-600" />

              <div>
                <p className="text-[11px] text-slate-500">Valid Till</p>
                <h2 className="text-sm font-semibold text-slate-900">
                  {expiresAt()}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Card */}
      <div
        className="
      w-full
      rounded-2xl
      border
      border-slate-200/70
      bg-white/90
      p-6
      shadow-[0_8px_30px_rgba(15,23,42,0.04)]
      "
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Share Interview
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Send interview invitations directly to candidates.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Button
            variant="outline"
            onClick={() => shareVia("email")}
            className="
          h-11
          rounded-xl
          border-slate-200
          text-sm
          hover:bg-slate-50
        "
          >
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>

          <Button
            variant="outline"
            onClick={() => shareVia("linkedin")}
            className="
          h-11
          rounded-xl
          border-slate-200
          text-sm
          hover:bg-slate-50
        "
          >
            <Linkedin className="mr-2 h-4 w-4" />
            LinkedIn
          </Button>

          <Button
            variant="outline"
            onClick={() => shareVia("whatsapp")}
            className="
          h-11
          rounded-xl
          border-slate-200
          text-sm
          hover:bg-slate-50
        "
          >
            <FaWhatsapp className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          variant="outline"
          onClick={() => router.push("/recruiter/dashboard")}
          className="
        h-11
        rounded-xl
        border-slate-200
        text-sm
        hover:bg-slate-50
      "
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Button
          onClick={() => router.push("/recruiter/dashboard/create-interview")}
          className="
        h-11
        rounded-xl
        bg-slate-950
        text-sm
        text-white
        hover:bg-slate-800
      "
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Interview
        </Button>
      </div>
    </div>
  );
};

export default InterviewLink;
