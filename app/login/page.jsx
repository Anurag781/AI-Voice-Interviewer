"use client";

import Image from "next/image";
import { LoginForm } from "../../components/login-form";

export default function LoginPage() {
  return (
    <div className="relative grid min-h-svh overflow-hidden bg-white lg:grid-cols-2">
      {/* Soft Premium Glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />

      {/* TOP RIGHT CURVE DESIGN */}
      <div className="pointer-events-none absolute top-0 right-0 opacity-60">
        <svg
          width="220"
          height="220"
          viewBox="0 0 220 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <circle
              key={i}
              cx="220"
              cy="0"
              r={10 + i * 7}
              stroke="#2563EB"
              strokeOpacity={0.14 - i * 0.006}
              strokeWidth="1.2"
            />
          ))}
        </svg>
      </div>

      {/* BOTTOM LEFT CURVE DESIGN */}
      <div className="pointer-events-none absolute bottom-0 left-0 opacity-60 rotate-180">
        <svg
          width="240"
          height="240"
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <circle
              key={i}
              cx="240"
              cy="0"
              r={12 + i * 7}
              stroke="#2563EB"
              strokeOpacity={0.14 - i * 0.006}
              strokeWidth="1.2"
            />
          ))}
        </svg>
      </div>

      {/* LEFT SIDE */}
      <div className="relative flex flex-col p-6 md:p-10">
        {/* Logo */}
        <div className="relative z-10 flex justify-center md:justify-start">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={260}
            height={120}
            className="w-[190px] object-contain"
            priority
          />
        </div>

        {/* Form */}
        <div className="relative z-10 flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative hidden lg:block min-h-screen overflow-hidden">
        <img
          src="/AIR.png"
          alt="AI"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>
    </div>
  );
}
