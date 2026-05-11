"use client";
import { useState, useEffect } from "react";
import Dropzone from "shadcn-dropzone";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";

export default function UploadCV() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        toast.error("User not logged in");
        return;
      }

      const useremail = session.user.email;

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, cv_file_path")
        .eq("email", useremail)
        .single();

      if (userError) {
        console.error("Failed to fetch user:", userError);
        toast.error("Failed to load user data");
        return;
      }

      setUser(userData);
    }

    fetchUser();
  }, []);

  // Handle file drop
  const handleFileDrop = (files) => {
    if (files.length > 0) {
      setUploadedFile(files[0]);
      console.log("Selected CV:", files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      toast.error("Please upload your CV before submitting.");
      return;
    }
    if (!user) {
      toast.error("User not loaded.");
      return;
    }

    setLoading(true);

    try {
      // Define storage path
      const fileExt = uploadedFile.name.split(".").pop();
      const fileName = `cv.${fileExt}`;
      const filePath = `cv/${user.id}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("cv-uploads")
        .upload(filePath, uploadedFile, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Update user record with file path
      const { error: updateError } = await supabase
        .from("users")
        .update({ cv_file_path: filePath })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      // Refresh user data to update UI
      setUser({ ...user, cv_file_path: filePath });
      setUploadedFile(null);
      toast.success("CV uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload CV.");
    } finally {
      setLoading(false);
    }
  };

  // Delete CV file from storage and DB
  const handleDelete = async () => {
    if (!user || !user.cv_file_path) return;

    setLoading(true);
    try {
      const { error: deleteError } = await supabase.storage
        .from("cv-uploads")
        .remove([user.cv_file_path]);

      if (deleteError) throw deleteError;

      const { error: updateError } = await supabase
        .from("users")
        .update({ cv_file_path: null })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setUser({ ...user, cv_file_path: null });
      toast.success("CV deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete CV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-[18px] font-semibold text-slate-900">
          CV Settings
        </h1>

        <p className="mt-1 text-[12px] text-slate-500">
          Upload and manage your resume for AI interviews.
        </p>
      </div>

      <div
        className="
        rounded-lg
        border
        border-slate-200/70
        bg-white/95
        p-4
        shadow-[0_4px_18px_rgba(15,23,42,0.04)]
      "
      >
        {!user ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-[12px] text-slate-500">Loading user...</p>
          </div>
        ) : user.cv_file_path ? (
          <div>
            {/* Uploaded State */}
            <div className="mb-4 flex items-center gap-3">
              <div
                className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-md
                bg-blue-50
                ring-1
                ring-blue-100
              "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4m4 0a2 2 0 004-2m-4 2a2 2 0 01-4-2"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-[14px] font-semibold text-slate-800">
                  CV Uploaded
                </h2>

                <p className="text-[11px] text-slate-500">
                  Your resume is successfully uploaded.
                </p>
              </div>
            </div>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="
              flex
              h-9
              items-center
              justify-center
              rounded-md
              bg-red-600
              px-4
              text-[13px]
              font-medium
              text-white
              transition-all
              duration-300
              hover:bg-red-700
              disabled:opacity-50
            "
            >
              {loading ? "Deleting..." : "Delete CV"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-[12px] font-medium text-slate-700">
                Upload your CV (PDF)
              </label>

              <div
                className="
                rounded-lg
                border
                border-dashed
                border-slate-300
                bg-slate-50/80
                p-4
              "
              >
                <Dropzone
                  onDropAccepted={handleFileDrop}
                  accept={{ "application/pdf": [".pdf"] }}
                  maxFiles={1}
                />
              </div>

              {uploadedFile && (
                <p className="mt-2 text-[11px] font-medium text-green-600">
                  Selected file: {uploadedFile.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
              flex
              h-9
              w-full
              items-center
              justify-center
              rounded-md
              bg-slate-950
              text-[13px]
              font-medium
              text-white
              shadow-[0_4px_16px_rgba(15,23,42,0.08)]
              transition-all
              duration-300
              hover:bg-slate-800
              disabled:opacity-50
            "
            >
              {loading ? "Uploading..." : "Upload CV"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
