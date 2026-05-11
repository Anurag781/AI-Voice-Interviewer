"use client";
import { useUser } from "@/app/provider";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/services/supabaseClient";

function WelcomeContainer() {
  const { user } = useUser();
  const [userData, setUserData] = useState({
    name: user?.name || "User",
    picture: null,
  });

  useEffect(() => {
    if (user?.email) {
      fetchLatestUserData();
    }
  }, [user]);

  const fetchLatestUserData = async () => {
    try {
      // Get latest user data from database
      const { data: userRecord, error } = await supabase
        .from("users")
        .select("name, picture")
        .eq("email", user.email)
        .single();

      if (!error && userRecord) {
        setUserData({
          name:
            userRecord.name ||
            user?.name ||
            user?.email?.split("@")[0] ||
            "User",
          picture: userRecord.picture || user?.picture,
        });
      } else {
        // Fallback to provider user data
        setUserData({
          name: user?.name || user?.email?.split("@")[0] || "User",
          picture: user?.picture,
        });
      }

      // Check for Google profile in localStorage
      if (typeof window !== "undefined") {
        const googleProfile = localStorage.getItem("googleProfile");
        if (googleProfile) {
          const { name, picture } = JSON.parse(googleProfile);
          setUserData((prev) => ({
            ...prev,
            name: name || prev.name,
            picture: picture || prev.picture,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Fallback to provider user data
      setUserData({
        name: user?.name || user?.email?.split("@")[0] || "User",
        picture: user?.picture,
      });
    }
  };

  return (
    <div
      className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-slate-200/70
      bg-white/95
      px-7
      py-6
      shadow-[0_14px_50px_rgba(15,23,42,0.05)]
    "
    >
      {/* Soft Glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="relative z-10 flex items-center justify-between">
        {/* Left Content */}
        <div className="min-w-0">
          <span
            className="
            inline-flex
            items-center
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
            Dashboard Overview
          </span>

          <h2 className="mt-4 text-[30px] font-bold tracking-tight text-slate-900">
            Welcome Back, <span className="text-blue-600">{userData.name}</span>
          </h2>

          <p className="mt-2 text-[15px] leading-7 text-slate-500">
            Your path to great opportunities starts with AI interviews.
          </p>
        </div>

        {/* Right Avatar */}
        {userData.picture ? (
          <div
            className="
            ml-6
            shrink-0
            rounded-full
            bg-white
            p-1.5
            ring-2
            ring-blue-100
            ring-offset-2
            shadow-sm
          "
          >
            <Image
              src={userData.picture}
              alt="userAvatar"
              width={74}
              height={74}
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <div
            className="
            ml-6
            flex
            h-[74px]
            w-[74px]
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-blue-50
            ring-2
            ring-blue-100
            ring-offset-2
            shadow-sm
          "
          >
            <span className="text-xl font-semibold text-blue-600">
              {userData.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default WelcomeContainer;
