"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/provider";
import { toast } from "sonner";

export default function Settings() {
  const router = useRouter();
  const { user: authUser } = useUser();

  const [user, setUser] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    // Simulate logout functionality
    localStorage.removeItem("authToken"); // Clear auth token
    router.push("/login"); // Redirect to login page
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        toast.success("Profile updated successfully!");

        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to update profile");
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Simulate password update
      setTimeout(() => {
        toast.success("Password changed successfully!");

        setPassword("");

        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to change password");

      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      setUser({
        name: authUser?.name || "",
        email: authUser?.email || "",
      });
    }
  }, [authUser]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[20px] font-semibold tracking-tight text-slate-900">
          Settings
        </h1>

        <p className="mt-1 text-[13px] text-slate-500">
          Manage your account settings and security preferences.
        </p>
      </div>

      {/* Profile Section */}
      <div
        className="
        rounded-xl
        border
        border-slate-200/70
        bg-white/95
        p-4
        shadow-[0_6px_24px_rgba(15,23,42,0.04)]
      "
      >
        <h2 className="mb-4 text-[15px] font-semibold text-slate-800">
          Profile
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-3">
          <div>
            <label
              htmlFor="name"
              className="block text-[12px] font-medium text-slate-700"
            >
              Full Name
            </label>

            <input
              type="text"
              id="name"
              name="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="
              mt-1
              h-9
              w-full
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3
              text-[13px]
              shadow-sm
              outline-none
              transition-all
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
            "
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-[12px] font-medium text-slate-700"
            >
              Email Address
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              disabled
              className="
              mt-1
              h-9
              w-full
              rounded-lg
              border
              border-slate-200
              bg-slate-50
              px-3
              text-[13px]
              text-slate-500
              shadow-sm
              cursor-not-allowed
              outline-none
            "
              required
            />

            <p className="mt-1 text-[11px] text-slate-500">
              Email address cannot be changed.
            </p>
          </div>

          <button
            type="submit"
            className="
            h-9
            w-full
            rounded-lg
            bg-slate-950
            text-[13px]
            font-medium
            text-white
            shadow-[0_6px_20px_rgba(15,23,42,0.08)]
            transition-all
            duration-300
            hover:bg-slate-800
          "
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Password Section */}
      <div
        className="
        rounded-xl
        border
        border-slate-200/70
        bg-white/95
        p-4
        shadow-[0_6px_24px_rgba(15,23,42,0.04)]
      "
      >
        <h2 className="mb-4 text-[15px] font-semibold text-slate-800">
          Change Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <label
              htmlFor="password"
              className="block text-[12px] font-medium text-slate-700"
            >
              New Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
              mt-1
              h-9
              w-full
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3
              text-[13px]
              shadow-sm
              outline-none
              transition-all
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
            "
              required
            />
          </div>

          <button
            type="submit"
            className="
            h-9
            w-full
            rounded-lg
            bg-slate-950
            text-[13px]
            font-medium
            text-white
            shadow-[0_6px_20px_rgba(15,23,42,0.08)]
            transition-all
            duration-300
            hover:bg-slate-800
          "
            disabled={loading}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* Logout */}
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="
          h-9
          rounded-lg
          bg-red-500
          px-4
          text-[13px]
          font-medium
          text-white
          shadow-sm
          transition-all
          duration-300
          hover:bg-red-600
        "
        >
          Logout
        </button>
      </div>
    </div>
  );
}
