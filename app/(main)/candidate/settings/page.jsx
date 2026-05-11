"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { useUser } from "@/app/provider";
import { toast } from "sonner";
import { User, Mail, Lock, LogOut, Save, Loader2 } from "lucide-react";

export default function Settings() {
  const router = useRouter();
  const { user } = useUser();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user?.name || "",
        email: user?.email || "",
      });
    }
  }, [user]);

  // UPDATE PROFILE
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { error } = await supabase.from("users").upsert(
        {
          email: profile.email,
          name: profile.name,
        },
        {
          onConflict: "email",
        },
      );

      if (error) {
        console.log(error);
        toast.error("Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // CHANGE PASSWORD
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Enter new password");
      return;
    }

    try {
      setPasswordLoading(true);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.log(error);
        toast.error(error.message);
        return;
      }

      toast.success("Password changed successfully!");
      setPassword("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-[18px] font-semibold text-slate-900">Settings</h1>

        <p className="mt-1 text-[12px] text-slate-500">
          Manage your account settings
        </p>
      </div>

      {/* PROFILE SECTION */}
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
        <div className="mb-4 flex items-center gap-2">
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
            <User className="h-3.5 w-3.5 text-blue-600" />
          </div>

          <div>
            <h2 className="text-[14px] font-semibold text-slate-800">
              Profile Information
            </h2>

            <p className="text-[11px] text-slate-500">
              Update your personal information
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-3">
          <div>
            <label className="text-[12px] font-medium text-slate-700">
              Full Name
            </label>

            <div className="relative mt-1.5">
              <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />

              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    name: e.target.value,
                  })
                }
                placeholder="Enter your name"
                className="
                h-9
                w-full
                rounded-md
                border
                border-slate-200
                bg-white
                pl-9
                pr-3
                text-[13px]
                outline-none
                transition-all
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-slate-700">
              Email Address
            </label>

            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />

              <input
                type="email"
                value={profile.email}
                disabled
                className="
                h-9
                w-full
                cursor-not-allowed
                rounded-md
                border
                border-slate-200
                bg-slate-50
                pl-9
                pr-3
                text-[13px]
                text-slate-500
              "
              />
            </div>

            <p className="mt-1 text-[10px] text-slate-500">
              Email address cannot be changed.
            </p>
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
            gap-2
            rounded-md
            bg-slate-950
            text-[13px]
            font-medium
            text-white
            shadow-[0_4px_16px_rgba(15,23,42,0.08)]
            transition-all
            duration-300
            hover:bg-slate-800
          "
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>

      {/* PASSWORD SECTION */}
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
        <div className="mb-4 flex items-center gap-2">
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
            <Lock className="h-3.5 w-3.5 text-blue-600" />
          </div>

          <div>
            <h2 className="text-[14px] font-semibold text-slate-800">
              Change Password
            </h2>

            <p className="text-[11px] text-slate-500">
              Keep your account secure
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <label className="text-[12px] font-medium text-slate-700">
              New Password
            </label>

            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="
                h-9
                w-full
                rounded-md
                border
                border-slate-200
                bg-white
                pl-9
                pr-3
                text-[13px]
                outline-none
                transition-all
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="
            flex
            h-9
            w-full
            items-center
            justify-center
            gap-2
            rounded-md
            bg-slate-950
            text-[13px]
            font-medium
            text-white
            shadow-[0_4px_16px_rgba(15,23,42,0.08)]
            transition-all
            duration-300
            hover:bg-slate-800
          "
          >
            {passwordLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Changing...
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" />
                Change Password
              </>
            )}
          </button>
        </form>
      </div>

      {/* LOGOUT */}
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-slate-800">Logout</h2>

            <p className="mt-1 text-[11px] text-slate-500">
              Sign out from your account
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="
            flex
            h-9
            items-center
            gap-1.5
            rounded-md
            bg-red-600
            px-4
            text-[13px]
            font-medium
            text-white
            transition-all
            duration-300
            hover:bg-red-700
          "
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
