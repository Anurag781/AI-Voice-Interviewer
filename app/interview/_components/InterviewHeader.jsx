import React from "react";
import Image from "next/image";

function InterviewHeader() {
  return (
    <header
      className="
        border-b
        border-slate-200/70
        bg-white/95
        backdrop-blur-xl
        shadow-[0_4px_20px_rgba(15,23,42,0.04)]
      "
    >
      <div
        className="
          mx-auto
          flex
          h-[68px]
          max-w-6xl
          items-center
          px-4
          sm:px-5
        "
      >
        <div className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Logo"
            width={145}
            height={48}
            className="
              h-auto
              w-[120px]
              object-contain
              sm:w-[135px]
            "
            priority
          />
        </div>
      </div>
    </header>
  );
}

export default InterviewHeader;