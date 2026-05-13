"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  Users,
  Sparkles,
  BarChart2,
  Clock,
  Check,
  Search,
  FileText,
  ShieldCheck,
  Award,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/services/supabaseClient";
import { useUser } from "@/app/provider";

export default function Home() {
  const router = useRouter();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { user } = useUser();

  /// lgoin wit hgoogle
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error(error.message);
  };

  const handleStartRecruiting = () => {
    router.push("/login"); //
  };

  useEffect(() => {
    // If user is loaded and logged in, redirect based on role
    if (user) {
      if (user.role === "recruiter") {
        router.push("/recruiter/dashboard");
      } else if (user.role === "candidate") {
        router.push("/candidate/dashboard");
      } else if (user.role === "admin" || user.role === "superadmin") {
        router.push("/admin");
      }
    }
  }, [user, router]);

  const clientLogos = [
    { logo: "/clientLogos/tata.png" },
    { logo: "/clientLogos/techmahindra.png" },
    { logo: "/clientLogos/eeshanya.png" },
    { logo: "/clientLogos/hrh.jpeg" },
    { logo: "/clientLogos/google.png" },
  ];

  const testimonials = [
    {
      quote:
        "From intuitive front-end design to seamless backend integration, the site is a true showcase of full-stack excellence.",
      author: "Dhanshree",
      image: "/user Photos/Dhanshree.jpeg",
      role: "Full Stack Developer, GreatHire",
      avatar: "/avatar2.jpg",
    },
    {
      quote:
        "Built with security at its core, the site ensures robust protection against vulnerabilities while maintaining smooth performance.",
      author: "Sujeeth",
      image: "/user Photos/Sujeeth.jpeg",
      role: "Information Security Analyst, GlobalSoft",
      avatar: "/avatar3.jpg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Premium Background System */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Base Layer */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,#f8fbff,white,#eef4ff)]" />

        {/* Premium Ambient Lights */}
        <div className="absolute top-[-6%] left-[10%] w-[380px] h-[380px] rounded-full bg-blue-400/12 blur-[120px] animate-float-slow" />

        <div className="absolute top-[16%] right-[6%] w-[320px] h-[320px] rounded-full bg-indigo-400/10 blur-[110px] animate-float-medium" />

        <div className="absolute bottom-[6%] left-[22%] w-[260px] h-[260px] rounded-full bg-cyan-300/8 blur-[100px] animate-float-fast" />

        <div className="absolute bottom-[10%] right-[16%] w-[220px] h-[220px] rounded-full bg-purple-300/8 blur-[90px] animate-float-medium" />

        {/* Elegant Top Glow */}
        <div className="absolute top-0 inset-x-0 h-[320px] bg-gradient-to-b from-blue-100/25 via-blue-50/8 to-transparent" />

        {/* Radial Premium Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_38%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.06),transparent_32%)]" />

        {/* Premium Mesh Overlay */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#94a3b810_1px,transparent_1px),linear-gradient(to_bottom,#94a3b810_1px,transparent_1px)] bg-[size:42px_42px]" />

        {/* Soft Noise Texture */}
        <div className="absolute inset-0 opacity-[0.012] mix-blend-soft-light bg-[url('/noise.png')]" />

        {/* Glass Fade */}
        <div className="absolute inset-0 backdrop-blur-[0.8px]" />
      </div>

      {/* Main Content */}
      <div className="container relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-4 sm:px-5 lg:px-6 py-10">
        {/* Hero Section */}
        <div className="relative text-center max-w-5xl w-full mx-auto px-5 py-12 overflow-hidden">
          {/* Background Glow Effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute top-16 right-0 w-56 h-56 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Premium AI Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-10 relative"
            >
              <div className="relative flex flex-col items-center">
                {/* Main Icon */}
                <div className="relative w-20 h-20 rounded-[24px] bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-[0_16px_45px_rgba(59,130,246,0.22)]">
                  {/* Soft Border */}
                  <div className="absolute inset-[1px] rounded-[23px] border border-white/20" />

                  <Brain className="w-9 h-9 text-white relative z-10" />

                  {/* Floating Spark */}
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-cyan-200 animate-pulse" />
                </div>

                {/* Label */}
                <div className="mt-4">
                  <span className="px-3 py-1 rounded-full border border-gray-200/70 bg-white/70 backdrop-blur-md text-[10px] font-semibold tracking-[0.24em] uppercase text-gray-700 shadow-sm">
                    AI Recruitment Platform
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-6"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[64px] font-black tracking-[-0.05em] leading-[0.92]">
                <span className="block text-gray-900">Hire Smarter.</span>

                <span className="block mt-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  Recruit Faster.
                </span>
              </h1>

              <div className="flex justify-center">
                <div className="h-[4px] w-24 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500" />
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-7 max-w-2xl text-sm sm:text-base md:text-[17px] font-medium tracking-[-0.02em] leading-[1.8] text-gray-600"
            >
              Streamline modern hiring with{" "}
              <span className="font-semibold text-gray-900">
                AI-powered candidate screening
              </span>
              , intelligent talent matching, and automated recruitment workflows
              designed to help recruiters discover{" "}
              <span className="font-semibold text-blue-600">
                exceptional candidates faster
              </span>{" "}
              with greater confidence and precision.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center gap-4"
            >
              <Button
                size="lg"
                onClick={handleStartRecruiting}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-6 text-base font-semibold text-white shadow-[0_14px_40px_rgba(59,130,246,0.28)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(59,130,246,0.36)] cursor-pointer"
              >
                <span className="relative z-10 flex items-center">
                  Start Recruiting
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>

                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>

              {/* Social Proof */}
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="flex -space-x-2.5">
                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                  <img
                    src="https://i.pravatar.cc/100?img=32"
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                  <img
                    src="https://i.pravatar.cc/100?img=16"
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                </div>

                <p className="text-left leading-snug text-[12px] font-medium">
                  Trusted by modern recruiters <br />
                  and fast-growing companies
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="w-full max-w-6xl mx-auto mt-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                value: "85%",
                label: "Reduction in time-to-hire",
                icon: <Clock className="w-5 h-5 text-blue-500" />,
                description:
                  "Companies using our platform fill positions faster",
              },
              {
                value: "3.2x",
                label: "Better candidate matches",
                icon: <Check className="w-5 h-5 text-green-500" />,
                description: "Higher quality candidates through AI matching",
              },
              {
                value: "95%",
                label: "Accuracy rate",
                icon: <BarChart2 className="w-5 h-5 text-indigo-500" />,
                description: "Precision in candidate-job matching",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group bg-white/75 backdrop-blur-xl rounded-[20px] border border-white/60 p-4 shadow-[0_10px_35px_rgba(15,23,42,0.04)] hover:shadow-[0_14px_40px_rgba(59,130,246,0.05)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Top Section */}
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm">
                    {stat.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Value */}
                    <div className="text-3xl font-black tracking-[-0.06em] text-gray-900 leading-none">
                      {stat.value}
                    </div>

                    {/* Label */}
                    <div className="mt-1 text-[14px] font-semibold tracking-[-0.02em] text-gray-800 leading-snug">
                      {stat.label}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-3 text-[12px] leading-5 font-medium text-gray-500">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="w-full max-w-6xl mx-auto mt-16">
          {/* Section Header */}
          <div className="text-center mb-12">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_6px_25px_rgba(15,23,42,0.04)]">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />

              <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-gray-600">
                AI Recruitment Workflow
              </span>
            </div>

            {/* Heading */}
            <div className="text-center mt-5">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.04em] text-gray-900 mb-3">
                How SmartHire Works
              </h2>

              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-7 font-medium">
                Our intelligent platform transforms your hiring process into
                three seamless AI-powered steps.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Premium Timeline */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-100 via-indigo-100 to-transparent" />
            </div>

            {/* Steps */}
            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Define Your Hiring Needs",
                  description:
                    "Share your job requirements and ideal candidate profile while AI understands your hiring expectations.",
                  icon: <FileText className="w-4 h-4 text-blue-500" />,
                  direction: "left",
                  accent: "from-blue-500 via-indigo-500 to-cyan-500",
                  iconBg: "bg-blue-50/80",
                },
                {
                  step: "02",
                  title: "Smart Candidate Matching",
                  description:
                    "AI analyzes candidate profiles, skills, and experience to identify the strongest matches instantly.",
                  icon: <Search className="w-4 h-4 text-rose-500" />,
                  direction: "right",
                  accent: "from-rose-500 via-orange-400 to-amber-400",
                  iconBg: "bg-rose-50/80",
                },
                {
                  step: "03",
                  title: "Review & Hire Faster",
                  description:
                    "Receive curated shortlists with AI-generated insights to simplify interviews and hiring decisions.",
                  icon: <Users className="w-4 h-4 text-violet-500" />,
                  direction: "left",
                  accent: "from-violet-500 via-indigo-500 to-cyan-500",
                  iconBg: "bg-violet-50/80",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  viewport={{ once: true }}
                  className={`relative flex ${
                    item.direction === "left" ? "justify-start" : "justify-end"
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div
                      className={`relative w-3 h-3 rounded-full bg-gradient-to-r ${item.accent} border-2 border-white shadow-md`}
                    />
                  </div>

                  {/* Card */}
                  <div className="group relative w-full lg:w-[42%]">
                    {/* Ambient Glow */}
                    <div
                      className={`absolute -inset-1 rounded-[24px] bg-gradient-to-r ${item.accent} opacity-0 blur-xl transition-all duration-500 group-hover:opacity-10`}
                    />

                    {/* Card */}
                    <div className="relative overflow-hidden rounded-[22px] border border-white/60 bg-white/75 backdrop-blur-2xl p-4 shadow-[0_8px_28px_rgba(15,23,42,0.035)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(59,130,246,0.06)]">
                      {/* Top Border */}
                      <div
                        className={`absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r ${item.accent}`}
                      />

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Top Row */}
                        <div className="flex items-start justify-between">
                          {/* Icon */}
                          <div
                            className={`w-10 h-10 rounded-xl ${item.iconBg} border border-white/80 bg-white/70 flex items-center justify-center shadow-sm`}
                          >
                            {item.icon}
                          </div>

                          {/* Step */}
                          <div className="text-right">
                            <div className="text-[8px] font-semibold tracking-[0.18em] uppercase text-gray-400">
                              Step
                            </div>

                            <div className="mt-0.5 text-lg font-black tracking-[-0.05em] text-gray-900">
                              {item.step}
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="mt-4">
                          {/* Title */}
                          <h3 className="text-[18px] font-bold tracking-[-0.03em] text-gray-900 leading-tight">
                            {item.title}
                          </h3>

                          {/* Divider */}
                          <div
                            className={`mt-2.5 h-[2px] w-8 rounded-full bg-gradient-to-r ${item.accent}`}
                          />

                          {/* Description */}
                          <p className="mt-3 text-[13px] leading-6 font-medium text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-6xl mx-auto mt-20">
          {/* Section Header */}
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.04em] text-gray-900 mb-4">
              Powerful Features
            </h2>

            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-7 font-medium">
              Built to help recruiters streamline hiring, improve candidate
              quality, and accelerate recruitment decisions with intelligent AI
              automation.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <Brain className="w-4 h-4 text-blue-600" />,
                title: "AI Candidate Matching",
                description:
                  "Advanced AI identifies top candidates based on skills, experience, and hiring intent.",
                highlights: [
                  "Skills analysis",
                  "Culture fit scoring",
                  "Experience matching",
                ],
                glow: "bg-blue-500/10",
                iconBg: "bg-blue-50",
              },
              {
                icon: <FileText className="w-4 h-4 text-indigo-600" />,
                title: "Automated Screening",
                description:
                  "Reduce manual effort with intelligent candidate evaluation and resume analysis.",
                highlights: [
                  "Resume parsing",
                  "Keyword analysis",
                  "Experience validation",
                ],
                glow: "bg-indigo-500/10",
                iconBg: "bg-indigo-50",
              },
              {
                icon: <BarChart2 className="w-4 h-4 text-violet-600" />,
                title: "Analytics Dashboard",
                description:
                  "Monitor hiring performance with actionable recruitment insights and metrics.",
                highlights: [
                  "Pipeline tracking",
                  "Hiring analytics",
                  "Source performance",
                ],
                glow: "bg-violet-500/10",
                iconBg: "bg-violet-50",
              },
              {
                icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
                title: "Bias Reduction",
                description:
                  "Create fair hiring workflows with structured AI-assisted candidate evaluations.",
                highlights: [
                  "Blind screening",
                  "Structured reviews",
                  "Diversity insights",
                ],
                glow: "bg-emerald-500/10",
                iconBg: "bg-emerald-50",
              },
              {
                icon: <Sparkles className="w-4 h-4 text-amber-600" />,
                title: "Candidate Engagement",
                description:
                  "Keep applicants engaged with personalized communication and smart automation.",
                highlights: [
                  "Personalized emails",
                  "Automated updates",
                  "Feedback collection",
                ],
                glow: "bg-amber-500/10",
                iconBg: "bg-amber-50",
              },
              {
                icon: <Award className="w-4 h-4 text-rose-600" />,
                title: "Employer Branding",
                description:
                  "Showcase company culture and strengthen your employer brand to attract talent.",
                highlights: [
                  "Career pages",
                  "Team profiles",
                  "Culture highlights",
                ],
                glow: "bg-rose-500/10",
                iconBg: "bg-rose-50",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: Math.floor(index / 3) * 0.08,
                }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-[26px] border border-white/70 bg-white/65 backdrop-blur-2xl p-5 shadow-[0_10px_35px_rgba(15,23,42,0.035)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_55px_rgba(59,130,246,0.07)]"
              >
                {/* Premium Ambient Glow */}
                <div
                  className={`absolute -top-16 -right-12 w-32 h-32 rounded-full ${feature.glow} blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700`}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-blue-50/20" />

                <div className="relative z-10">
                  {/* Top */}
                  <div className="flex items-start justify-between">
                    {/* Icon */}
                    <div className="relative">
                      {/* Soft Glow */}
                      <div
                        className={`absolute inset-0 rounded-xl ${feature.glow} blur-xl opacity-60 scale-125`}
                      />

                      <div
                        className={`relative w-11 h-11 rounded-xl ${feature.iconBg} border border-white/80 bg-white/80 backdrop-blur-md flex items-center justify-center shadow-sm`}
                      >
                        {feature.icon}
                      </div>
                    </div>

                    {/* Tiny Badge */}
                    <div className="px-2 py-0.5 rounded-full border border-gray-100 bg-white/70 backdrop-blur-md">
                      <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-gray-400">
                        AI
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-5">
                    {/* Title */}
                    <h3 className="text-[19px] font-bold tracking-[-0.035em] text-gray-900 leading-tight">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 text-[13px] leading-6 font-medium text-gray-600">
                      {feature.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {feature.highlights.map((highlight, i) => (
                      <div
                        key={i}
                        className="inline-flex items-center rounded-full border border-white/80 bg-gray-50/80 px-2.5 py-1 shadow-sm"
                      >
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 flex items-center justify-center mr-1.5">
                          <Check className="w-2 h-2 text-emerald-600" />
                        </div>

                        <span className="text-[11px] font-medium text-gray-700">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="w-full max-w-4xl mx-auto mt-14">
          <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/70 backdrop-blur-2xl shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
            {/* Ambient Glow */}
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full" />
            <div className="absolute -bottom-20 right-0 w-72 h-72 bg-indigo-500/10 blur-3xl rounded-full" />

            <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] min-h-[320px] relative z-10">
              {/* Left Side */}
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-5 lg:p-6 text-white">
                {/* Premium Layers */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_35%)]" />

                <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)] bg-[size:28px_28px]" />

                {/* Ambient Glow */}
                <div className="absolute -top-20 -left-16 w-64 h-64 bg-white/10 blur-3xl rounded-full" />

                <div className="relative z-10">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/10 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />

                    <span className="text-[8px] font-semibold tracking-[0.2em] uppercase text-blue-100">
                      AI Recruitment Platform
                    </span>
                  </div>

                  {/* Heading */}
                  <div className="mt-5">
                    <h2 className="text-[26px] sm:text-[30px] font-black tracking-[-0.06em] leading-[0.98]">
                      Hire Smarter.
                    </h2>

                    <h2 className="mt-1 text-[26px] sm:text-[30px] font-black tracking-[-0.06em] leading-[0.98] text-blue-100">
                      Recruit Faster.
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-[13px] leading-6 text-blue-100/85 font-medium max-w-sm">
                    TalentAI helps recruiters discover exceptional candidates
                    with AI-powered screening, intelligent matching, and
                    automated hiring workflows.
                  </p>

                  {/* Users */}
                  <div className="mt-5 flex items-center gap-3">
                    {/* Avatars */}
                    <div className="flex -space-x-2">
                      {[
                        "https://i.pravatar.cc/100?img=12",
                        "https://i.pravatar.cc/100?img=32",
                        "https://i.pravatar.cc/100?img=17",
                      ].map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt=""
                          className="w-7 h-7 rounded-full border-2 border-white/80 object-cover shadow-sm"
                        />
                      ))}
                    </div>

                    {/* Text */}
                    <div>
                      <div className="text-[12px] font-semibold text-white">
                        Trusted by recruiters
                      </div>

                      <div className="text-[10px] text-blue-100/75 font-medium">
                        worldwide
                      </div>
                    </div>
                  </div>

                  {/* Client Logos */}
                  <div className="mt-6">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-blue-100/65 font-semibold mb-3">
                      Trusted by teams at
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {clientLogos.map((client, i) => (
                        <div key={i} className="group relative">
                          {/* Glow */}
                          <div className="absolute inset-0 rounded-xl bg-white/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Logo Box */}
                          <div className="relative h-9 w-9 rounded-xl border border-white/15 bg-white/10 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:bg-white/15">
                            <div className="h-7 w-7 rounded-lg bg-white flex items-center justify-center shadow-sm overflow-hidden">
                              <img
                                src={client.logo}
                                alt={`Client Logo ${i + 1}`}
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 flex items-center gap-5 border-t border-white/10 pt-4">
                    {[
                      { value: "10k+", label: "Recruiters" },
                      { value: "95%", label: "Accuracy" },
                      { value: "3.2x", label: "Faster Hiring" },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="text-[18px] font-black tracking-[-0.05em]">
                          {item.value}
                        </div>

                        <div className="mt-1 text-[10px] text-blue-100/70 font-medium">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="relative p-5 lg:p-6 bg-white/50">
                {/* Quote */}
                <div className="absolute top-1 right-4 text-[52px] font-black text-blue-50 leading-none">
                  ”
                </div>

                <div className="relative h-full flex flex-col justify-between min-h-[220px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTestimonial}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0"
                    >
                      <div className="h-full flex flex-col justify-between">
                        {/* Top */}
                        <div>
                          {/* Stars */}
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Sparkles
                                key={i}
                                className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500"
                              />
                            ))}
                          </div>

                          {/* Quote */}
                          <p className="text-[15px] sm:text-[17px] font-semibold leading-7 tracking-[-0.03em] text-gray-900">
                            “{testimonials[currentTestimonial].quote}”
                          </p>
                        </div>

                        {/* Bottom */}
                        <div className="mt-5 flex items-center justify-between">
                          {/* User */}
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                              <Image
                                src={testimonials[currentTestimonial].image}
                                alt={testimonials[currentTestimonial].author}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Info */}
                            <div>
                              <div className="text-[13px] font-bold text-gray-900">
                                {testimonials[currentTestimonial].author}
                              </div>

                              <div className="text-[11px] text-gray-500">
                                {testimonials[currentTestimonial].role}
                              </div>
                            </div>
                          </div>

                          {/* Indicators */}
                          <div className="flex items-center gap-1.5">
                            {testimonials.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentTestimonial(index)}
                                className={`rounded-full transition-all duration-300 ${
                                  currentTestimonial === index
                                    ? "w-5 h-1.5 bg-blue-600"
                                    : "w-1.5 h-1.5 bg-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Animation Styles */}
      <style jsx global>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, -12px, 0) scale(1.01);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-6px, -10px, 0) scale(1.01);
          }
        }

        @keyframes float-fast {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(4px, -6px, 0);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.55;
            transform: scale(1.04);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        /* Floating Animations */
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
          will-change: transform;
        }

        .animate-float-medium {
          animation: float-medium 8s ease-in-out infinite;
          will-change: transform;
        }

        .animate-float-fast {
          animation: float-fast 6s ease-in-out infinite;
          will-change: transform;
        }

        /* Premium Glow Pulse */
        .animate-pulse-glow {
          animation: pulse-glow 5s ease-in-out infinite;
          will-change: transform, opacity;
        }

        /* Premium Gradient Motion */
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 10s ease infinite;
        }

        /* Glass Shimmer Effect */
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.22) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 5s linear infinite;
        }

        /* Smooth Rendering */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          text-rendering: optimizeLegibility;
          overflow-x: hidden;
        }

        /* Better Scroll */
        html {
          scroll-behavior: smooth;
        }

        /* Premium Selection */
        ::selection {
          background: rgba(59, 130, 246, 0.12);
          color: #0f172a;
        }

        /* Cleaner Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.35);
          border-radius: 999px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.45);
        }
      `}</style>
    </div>
  );
}
