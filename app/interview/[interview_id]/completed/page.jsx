import { Check, Clock, Mail, Shield, ChevronRight } from "lucide-react";
import React from "react";

const InterviewCompleted = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom_right,#f8fafc,white,#eef4ff)] flex items-center justify-center px-4 py-8 sm:px-5">
      <div
        className="
        relative
        w-full
        max-w-lg
        overflow-hidden
        rounded-3xl
        border
        border-slate-200/70
        bg-white/95
        p-5
        sm:p-6
        shadow-[0_14px_50px_rgba(15,23,42,0.06)]
        backdrop-blur-xl
      "
      >
        {/* Decorative Blur */}
        <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-indigo-100/40 blur-3xl" />

        {/* Success Icon */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className="
            relative
            mb-6
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            bg-gradient-to-br
            from-green-100
            to-green-50
            ring-4
            ring-green-50
          "
          >
            <div className="absolute inset-0 rounded-full border border-green-200 animate-ping opacity-60" />

            <Check className="h-10 w-10 text-green-600" />
          </div>

          {/* Heading */}
          <h1
            className="
            text-center
            text-[24px]
            sm:text-[28px]
            font-bold
            tracking-tight
            text-slate-900
          "
          >
            Interview Submitted{" "}
            <span className="text-blue-600">Successfully</span>
          </h1>

          <p
            className="
            mt-3
            text-center
            text-[13px]
            sm:text-[14px]
            leading-6
            sm:leading-7
            text-slate-500
          "
          >
            Thank you for completing your interview with{" "}
            <span
              className="
              rounded-md
              bg-blue-50
              px-2
              py-1
              font-medium
              text-blue-600
            "
            >
              Recruiter AI
            </span>
            .
          </p>
        </div>

        {/* Timeline Cards */}
        <div className="relative z-10 mt-7 space-y-4">
          {/* Card 1 */}
          <div
            className="
            flex
            items-start
            rounded-2xl
            border
            border-blue-100
            bg-blue-50/40
            p-4
          "
          >
            <div
              className="
              mr-3
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-blue-100
              bg-white
            "
            >
              <Shield className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h3
                className="
                flex
                items-center
                text-[13px]
                sm:text-[14px]
                font-semibold
                text-slate-800
              "
              >
                Secure Processing
                <ChevronRight className="ml-1 h-4 w-4 text-blue-400" />
              </h3>

              <p
                className="
                mt-1
                text-[11px]
                sm:text-[12px]
                leading-5
                sm:leading-6
                text-slate-500
              "
              >
                Your responses are securely encrypted and stored safely.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="
            flex
            items-start
            rounded-2xl
            border
            border-indigo-100
            bg-indigo-50/40
            p-4
          "
          >
            <div
              className="
              mr-3
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-indigo-100
              bg-white
            "
            >
              <Clock className="h-5 w-5 text-indigo-600" />
            </div>

            <div>
              <h3
                className="
                flex
                items-center
                text-[13px]
                sm:text-[14px]
                font-semibold
                text-slate-800
              "
              >
                Review Timeline
                <ChevronRight className="ml-1 h-4 w-4 text-indigo-400" />
              </h3>

              <p
                className="
                mt-1
                text-[11px]
                sm:text-[12px]
                leading-5
                sm:leading-6
                text-slate-500
              "
              >
                Our team will review your interview within{" "}
                <span className="font-medium text-indigo-600">
                  3 business days
                </span>
                .
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className="
            flex
            items-start
            rounded-2xl
            border
            border-green-100
            bg-green-50/40
            p-4
          "
          >
            <div
              className="
              mr-3
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-green-100
              bg-white
            "
            >
              <Mail className="h-5 w-5 text-green-600" />
            </div>

            <div>
              <h3
                className="
                flex
                items-center
                text-[13px]
                sm:text-[14px]
                font-semibold
                text-slate-800
              "
              >
                Next Steps
                <ChevronRight className="ml-1 h-4 w-4 text-green-400" />
              </h3>

              <p
                className="
                mt-1
                text-[11px]
                sm:text-[12px]
                leading-5
                sm:leading-6
                text-slate-500
              "
              >
                You will receive an update via email soon.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="
          relative
          z-10
          mt-6
          rounded-2xl
          border
          border-slate-200
          bg-slate-50/80
          p-4
          text-center
        "
        >
          <div className="mb-2 flex items-center justify-center gap-1.5">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />

            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400 delay-100" />

            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400 delay-200" />
          </div>

          <p className="text-[12px] sm:text-[13px] font-medium text-slate-700">
            You&apos;ve completed all steps successfully.
          </p>

          <p className="mt-2 text-[10px] sm:text-[11px] text-slate-500">
            Need help? Contact{" "}
            <span className="font-medium text-blue-600">support@email.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewCompleted;
