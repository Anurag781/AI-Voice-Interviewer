import {
  BriefcaseBusinessIcon,
  Code2Icon,
  User2Icon,
  Component,
  Puzzle,
  Calendar,
  LayoutDashboard,
  List,
  Settings,
  WalletCards,
  LogOutIcon,
  Video,
} from "lucide-react";

export const SideBarOptions = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/recruiter/dashboard",
  },
  {
    name: "Scheduled Interview",
    icon: Calendar,
    path: "/recruiter/scheduled-interview",
  },
  {
    name: "All Interview",
    icon: List,
    path: "/recruiter/all-interview",
  },
  {
    name: "Profile",
    icon: User2Icon,
    path: "/recruiter/profile",
  },
  {
    name: "Billing",
    icon: WalletCards,
    path: "/recruiter/billing",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/recruiter/settings",
  },
];

export const SideBarCandidate = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/candidate/dashboard",
  },
  {
    name: "interviews",
    icon: Video,
    path: "/candidate/interviews",
  },
  {
    name: "Profile",
    icon: User2Icon,
    path: "/candidate/profile",
  },
    {
    name: 'Settings',
    icon: Settings,
    path: '/candidate/settings'
  },
];

export const InterviewType = [
  {
    name: "Technical",
    icon: Code2Icon,
  },
  {
    name: "Behavioral",
    icon: User2Icon,
  },
  {
    name: "Experience",
    icon: BriefcaseBusinessIcon,
  },
  {
    name: "Problem Solving",
    icon: Puzzle,
  },
  {
    name: "Leadership",
    icon: Component,
  },
];

export const QUESTIONS_PROMPT = `
You are an expert AI interviewer.

Job Title: {{jobTitle}}

Job Description:
{{jobDescription}}

Interview Duration:
{{duration}}

Selected Interview Types:
{{type}}

Your task:

1. Analyze the job description carefully.

2. Generate interview questions STRICTLY based on the selected interview type.

3. Adjust the number and difficulty of questions according to interview duration.

4. Questions should feel realistic and professional.

5. Follow these strict rules:

- If Technical is selected:
  generate ONLY technical questions.

- If Behavioral is selected:
  generate ONLY behavioral questions.

- If Experience is selected:
  generate ONLY experience-based questions.

- If Problem Solving is selected:
  generate ONLY problem-solving and scenario-based questions.

- If Leadership is selected:
  generate ONLY leadership and team-management questions.

6. Do NOT generate:
- self introduction questions
- salary negotiation questions
- closing questions
unless explicitly selected.

7. Keep questions concise and interview-focused.

Return ONLY valid JSON.

Response format:

{
  "interviewQuestions": [
    {
      "question": "Explain React hooks",
      "type": "technical"
    }
  ]
}

Allowed type values:
- technical
- behavioral
- experience
- problemSolving
- leadership

Important Rules:
- Do not include markdown
- Do not include triple backticks
- Do not include explanations
- Return valid JSON only
`;

export const FEEDBACK_PROMPT = `
You are an expert AI interviewer and recruiter.

Analyze the following interview conversation and provide professional candidate feedback.

Interview Conversation:
{{conversation}}

Your task:

1. Analyze the candidate based on:
- communication
- technical knowledge
- confidence
- clarity
- problem solving
- professionalism

2. Return:
- a detailed rating object for each skill area
- overall rating out of 10
- summary
- strengths
- weaknesses
- improvements
- recommendation
- a short recommendation message

Return ONLY valid JSON.

Response format:

{
  "rating": {
    "TechnicalSkills": 8,
    "Communication": 9,
    "ProblemSolving": 7,
    "Experience": 8,
    "Behavioral": 8,
    "Thinking": 7
  },
  "overallScore": 8,
  "summary": "Candidate demonstrated strong React fundamentals and communication skills.",
  "strengths": [
    "Strong technical understanding",
    "Clear communication",
    "Good confidence level"
  ],
  "weaknesses": [
    "Limited backend knowledge"
  ],
  "improvements": [
    "Practice system design",
    "Improve API optimization knowledge"
  ],
  "recommendation": "Recommended for next round",
  "recommendationMessage": "Great candidate for the next phase with a strong technical foundation."
}

Important Rules:
- Do not include markdown
- Do not include triple backticks
- No explanations
- Return valid JSON only
`;
