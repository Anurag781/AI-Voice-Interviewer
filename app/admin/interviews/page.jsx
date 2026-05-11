"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Search,
  Filter,
  Download,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import { supabase } from "@/services/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import moment from "moment";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function InterviewAnalytics() {
  const [interviews, setinterviews] = useState([]);
  const [filteredinterviews, setFilteredinterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    fetchinterviews();
  }, []);

  useEffect(() => {
    filterAndSortinterviews();
  }, [interviews, searchTerm, sortBy, sortOrder]);

  const fetchinterviews = async () => {
    try {
      setLoading(true);
      console.log("Fetching interviews...");

      // Test database connection first
      const { data: testData, error: testError } = await supabase
        .from("interviews")
        .select("count", { count: "exact", head: true });

      console.log("Database connection test:", { testData, testError });

      if (testError) {
        console.error("Database connection error:", testError);
        toast.error("Database connection failed");
        setinterviews([]);
        return;
      }

      // First, try to get interviews
      const { data: interviewsData, error: interviewsError } = await supabase
        .from("interviews")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("interviews query result:", {
        interviewsData,
        interviewsError,
      });

      if (interviewsError) {
        console.error("Error fetching interviews:", interviewsError);
        toast.error("Failed to fetch interviews");
        setinterviews([]);
        return;
      }

      // If no interviews found, set empty array
      if (!interviewsData || interviewsData.length === 0) {
        console.log("No interviews found in database");
        setinterviews([]);
        return;
      }

      console.log(`Found ${interviewsData.length} interviews`);
      console.log(interviewsData[0]);

      // Get candidate counts and results for each interview
      const interviewsWithStats = await Promise.all(
        interviewsData.map(async (interview) => {
          try {
            const { data: results, error: resultsError } = await supabase
              .from("interview_results")
              .select("*")
              .eq("interview_id", interview.interview_id);

            console.log(
              "Results for interview",
              interview.interview_id,
              results,
            );

            if (resultsError) {
              console.error(
                "Error fetching results for interview:",
                interview.interview_id,
                resultsError,
              );
              // Return interview with empty stats if results fetch fails
              return {
                ...interview,
                candidateCount: 0,
                completedCount: 0,
                totalDuration: 0,
                avgScore: 0,
              };
            }

            const resultsData = results || [];

            // use all results
            const completedResults = resultsData;

            // total duration
            const totalDuration = completedResults.reduce((sum, r) => {
              if (!r.created_at || !r.completed_at) {
                return sum;
              }

              const start = new Date(r.created_at);
              const end = new Date(r.completed_at);

              const durationInMinutes = Math.max(
                1,
                Math.round((end - start) / 1000 / 60),
              );

              return sum + durationInMinutes;
            }, 0);

            // extract score safely
            const scores = completedResults.map((r) => {
              try {
                let parsedTranscript = r.conversation_transcript;

                if (typeof parsedTranscript === "string") {
                  parsedTranscript = JSON.parse(parsedTranscript);
                }

                const feedback =
                  parsedTranscript?.feedback || parsedTranscript || {};

                const ratings = feedback?.rating || {};

                const ratingValues = Object.values(ratings).filter(
                  (val) => typeof val === "number",
                );

                if (ratingValues.length === 0) return 0;

                return (
                  ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length
                );
              } catch (e) {
                return 0;
              }
            });

            // valid scores only
            const validScores = scores.filter((s) => s > 0);

            console.log("Scores:", validScores);

            // average score
            const avgScore =
              validScores.length > 0
                ? validScores.reduce((sum, score) => sum + score, 0) /
                  validScores.length
                : 0;

            return {
              ...interview,
              candidateCount: resultsData.length,
              completedCount: completedResults.length,
              totalDuration,
              avgScore: Math.round(avgScore * 100) / 100,
            };
          } catch (error) {
            console.error("Error processing interview:", interview.id, error);
            // Return interview with empty stats if processing fails
            return {
              ...interview,
              candidateCount: 0,
              completedCount: 0,
              totalDuration: 0,
              avgScore: 0,
            };
          }
        }),
      );

      setinterviews(interviewsWithStats);
    } catch (error) {
      console.error("Error in fetchinterviews:", error);
      toast.error("Failed to fetch interviews");
      setinterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortinterviews = () => {
    let filtered = [...interviews].filter((interview) => {
      const title = (
        interview.title ||
        interview.name ||
        interview.jobposition ||
        ""
      ).toLowerCase();

      const useremail = (
        interview.useremail ||
        interview.email ||
        ""
      ).toLowerCase();

      const query = searchTerm.toLowerCase();

      return title.includes(query) || useremail.includes(query);
    });

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "created_at") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortBy === "candidateCount" || sortBy === "avgScore") {
        aValue = Number(aValue || 0);
        bValue = Number(bValue || 0);
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
      }

      if (typeof bValue === "string") {
        bValue = bValue.toLowerCase();
      }

      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
          ? 1
          : -1;
    });

    setFilteredinterviews(filtered);
  };

  const exportinterviewsToCSV = () => {
    const csvContent = [
      [
        "Title",
        "Creator",
        "Created Date",
        "Candidates",
        "Completed",
        "Avg Score",
        "Total Duration (min)",
        "Status",
      ],
      ...filteredinterviews.map((interview) => [
        interview.title || interview.name || "N/A",
        interview.useremail || interview.email || "N/A",
        moment(interview.created_at).format("YYYY-MM-DD HH:mm"),
        interview.candidateCount,
        interview.completedCount,
        interview.avgScore,
        Math.round(interview.totalDuration / 60),
        interview.candidateCount > 0 ? "Active" : "No Candidates",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interviews-${moment().format("YYYY-MM-DD")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("interviews exported successfully");
  };

  const getStatusColor = (interview) => {
    if (interview.completedCount > 0) return "text-green-600 bg-green-50";
    if (interview.candidateCount > 0) return "text-blue-600 bg-blue-50";
    return "text-gray-600 bg-gray-50";
  };

  const getStatusText = (interview) => {
    if (interview.completedCount > 0) return "Completed";
    if (interview.candidateCount > 0) return "In Progress";
    return "No Candidates";
  };

  const getCompletionRate = (interview) => {
    if (interview.candidateCount === 0) return 0;
    return Math.round(
      (interview.completedCount / interview.candidateCount) * 100,
    );
  };

  const handleDeleteInterview = async (interview) => {
    setDeletingId(interview.interview_id);
    setShowDeleteAlert(true);
  };

  const confirmDeleteInterview = async () => {
    const interview = filteredinterviews.find(
      (i) => i.interview_id === deletingId,
    );
    if (!interview) return;
    try {
      // Delete interview results first
      const { error: resultsError } = await supabase
        .from("interview_results")
        .delete()
        .eq("interview_id", interview.interview_id);
      if (resultsError) {
        toast.error("Failed to delete interview results");
        setShowDeleteAlert(false);
        setDeletingId(null);
        return;
      }
      // Delete the interview
      const { error: interviewError } = await supabase
        .from("interviews")
        .delete()
        .eq("interview_id", interview.interview_id);
      if (interviewError) {
        toast.error("Failed to delete interview");
      } else {
        toast.success("Interview deleted successfully");
        fetchinterviews();
      }
    } catch (e) {
      toast.error("Error deleting interview");
    } finally {
      setShowDeleteAlert(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Interview Analytics
          </h1>

          <p className="text-slate-500 mt-2 text-sm">
            Monitor interview performance and candidate results
          </p>
        </div>

        <Button
          onClick={exportinterviewsToCSV}
          className="
          rounded-2xl
          bg-slate-900
          hover:bg-slate-800
          shadow-sm
          px-4
          h-10
          text-sm
          w-fit
        "
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total interviews
            </CardTitle>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {interviews.length}
            </div>

            <p className="text-xs text-slate-500 mt-1">Created interviews</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Candidates
            </CardTitle>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100">
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {interviews.reduce(
                (sum, interview) => sum + interview.candidateCount,
                0,
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Interview participants
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Completed interviews
            </CardTitle>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 border border-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {interviews.reduce(
                (sum, interview) => sum + interview.completedCount,
                0,
              )}
            </div>

            <p className="text-xs text-slate-500 mt-1">Finished interviews</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Avg Score
            </CardTitle>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 border border-orange-100">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-blue-700">
              {interviews.length > 0
                ? Math.round(
                    (interviews.reduce(
                      (sum, interview) => sum + interview.avgScore,
                      0,
                    ) /
                      interviews.length) *
                      100,
                  ) / 100
                : 0}
            </div>

            <p className="text-xs text-slate-500 mt-1">Average score</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Search & Filter interviews
          </CardTitle>

          <CardDescription>
            Find specific interviews or filter by various criteria
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />

                <Input
                  placeholder="Search by title or creator email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                  pl-10
                  h-10
                  rounded-xl
                  border-slate-200
                  bg-slate-50/80
                  focus-visible:ring-blue-500
                "
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="
                h-10
                rounded-xl
                border
                border-slate-200
                bg-slate-50/80
                px-3
                text-sm
                outline-none
              "
              >
                <option value="created_at">Created Date</option>
                <option value="title">Title</option>
                <option value="candidateCount">Candidates</option>
                <option value="avgScore">Score</option>
              </select>

              <Button
                variant="outline"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="
                h-10
                rounded-xl
                border-slate-200
                bg-slate-50/80
                hover:bg-slate-100
              "
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* interviews Table */}
      <Card className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
                All interviews ({filteredinterviews.length})
              </CardTitle>

              <CardDescription className="mt-1 text-sm text-slate-500">
                Complete list of interviews with performance metrics
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="
                  flex
                  items-center
                  gap-4
                  p-4
                  border
                  border-slate-200
                  rounded-2xl
                  bg-white
                "
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-slate-200 animate-pulse" />

                    <div className="h-3 w-1/4 rounded bg-slate-200 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredinterviews.map((interview) => (
                <div key={interview.interview_id} className="relative group">
                  <Link
                    href={`/admin/interviews/${interview.interview_id}`}
                    className="block"
                  >
                    <div
                      className="
                      rounded-2xl
                      border
                      border-slate-200/70
                      bg-white
                      p-3.5
                      sm:p-4
                      shadow-sm
                      transition-all
                      duration-300
                      hover:shadow-md
                      hover:border-blue-200
                      hover:bg-blue-50/30
                    "
                    >
                      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        {/* LEFT SECTION */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* Icon */}
                          <div
                            className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-blue-100
                            bg-gradient-to-br
                            from-blue-50
                            to-indigo-50
                          "
                          >
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <h3
                              className="
                              text-sm
                              sm:text-base
                              font-semibold
                              text-slate-900
                              leading-tight
                              truncate
                            "
                            >
                              {interview.title ||
                                interview.name ||
                                interview.jobposition ||
                                interview.jobdescription ||
                                "Untitled Interview"}
                            </h3>

                            <div
                              className="
                              mt-2
                              flex
                              flex-col
                              sm:flex-row
                              sm:flex-wrap
                              gap-2
                              sm:gap-3
                              text-xs
                              text-slate-500
                            "
                            >
                              <span className="flex items-center truncate">
                                <Users className="w-3 h-3 mr-1 shrink-0" />

                                {interview.useremail ||
                                  interview.email ||
                                  "Unknown"}
                              </span>

                              <span className="flex items-center whitespace-nowrap">
                                <Calendar className="w-3 h-3 mr-1 shrink-0" />

                                {moment(interview.created_at).format(
                                  "MMM DD, YYYY",
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT STATS */}
                        <div
                          className="
                          grid
                          grid-cols-2
                          md:grid-cols-4
                          gap-2
                          w-full
                          xl:w-auto
                          xl:min-w-[430px]
                        "
                        >
                          {/* Candidates */}
                          <div
                            className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-200/70
                            bg-slate-50/80
                            px-2.5
                            py-2.5
                            text-center
                            min-h-[72px]
                          "
                          >
                            <div className="text-base font-bold text-slate-900">
                              {interview.candidateCount}
                            </div>

                            <div className="text-[10px] text-slate-500 mt-1">
                              Candidates
                            </div>

                            <div className="text-[10px] font-medium text-green-600 mt-1">
                              {interview.completedCount} Completed
                            </div>
                          </div>

                          {/* Avg Score */}
                          <div
                            className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-blue-100
                            bg-blue-50/70
                            px-2.5
                            py-2.5
                            text-center
                            min-h-[72px]
                          "
                          >
                            <div className="text-base font-bold text-blue-700">
                              {Number(interview.avgScore || 0).toFixed(1)}
                            </div>

                            <div className="text-[10px] text-slate-500 mt-1">
                              Avg Score
                            </div>

                            <div className="text-[10px] font-medium text-blue-600 mt-1">
                              {getCompletionRate(interview)}% Completion
                            </div>
                          </div>

                          {/* Total Time */}
                          <div
                            className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-slate-200/70
                            bg-slate-50/80
                            px-2.5
                            py-2.5
                            text-center
                            min-h-[72px]
                          "
                          >
                            <div className="text-base font-bold text-slate-900 whitespace-nowrap">
                              <div className="text-base font-bold text-slate-900 whitespace-nowrap">
                                <div className="text-base font-bold text-slate-900 whitespace-nowrap">
                                  {interview.totalDuration > 0
                                    ? `${Math.round(interview.totalDuration)} min`
                                    : "0 min"}
                                </div>
                              </div>
                            </div>

                            <div className="text-[10px] text-slate-500 mt-1">
                              Total Time
                            </div>
                          </div>

                          {/* Status */}
                          <div className="flex items-center justify-center">
                            <div
                              className={`
                              inline-flex
                              items-center
                              justify-center
                              min-w-[100px]
                              whitespace-nowrap
                              rounded-full
                              px-3
                              py-1.5
                              text-[10px]
                              font-semibold
                              shadow-sm
                              ${getStatusColor(interview)}
                            `}
                            >
                              {getStatusText(interview)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Delete Button */}
                  <button
                    className="
                     absolute
                     top-3
                     right-3
                     z-20
                     flex
                     h-8
                     w-8
                     sm:h-9
                     sm:w-9
                     items-center
                     justify-center
                     rounded-xl
                     bg-red-50/90
                     text-red-600
                     backdrop-blur-sm
                     transition-all
                     duration-200
                     hover:bg-red-100
                     hover:text-red-700
                     hover:scale-105
                 
                     opacity-100
                     lg:opacity-0
                     lg:group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteInterview(interview);
                    }}
                    title="Delete Interview"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}

              {/* Empty State */}
              {filteredinterviews.length === 0 && !loading && (
                <div className="text-center py-14">
                  <div
                    className="
                    flex
                    items-center
                    justify-center
                    w-14
                    h-14
                    rounded-full
                    bg-slate-100
                    mx-auto
                    mb-4
                  "
                  >
                    <BarChart3 className="w-7 h-7 text-slate-300" />
                  </div>

                  <h3 className="text-base font-semibold text-slate-800">
                    No interviews found
                  </h3>

                  <p className="text-sm text-slate-500 mt-2">
                    No interviews match your current search or filters.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="rounded-2xl border border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">
              Delete Interview
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete this interview and all its
              results? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setShowDeleteAlert(false)}
              className="rounded-xl"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmDeleteInterview}
              className="bg-red-600 hover:bg-red-700 rounded-xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default InterviewAnalytics;
