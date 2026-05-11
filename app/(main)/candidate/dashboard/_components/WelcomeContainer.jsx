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
      flex
      items-center
      justify-between
      rounded-3xl
      border
      border-slate-200/70
      bg-white/95
      px-6
      py-5
      shadow-[0_14px_50px_rgba(15,23,42,0.05)]
    "
    >
      {/* Left Content */}
      <div className="min-w-0">
        <h2 className="text-[22px] font-semibold tracking-tight text-slate-900">
          Welcome Back, <span className="text-blue-600">{userData.name}</span>
        </h2>

        <p className="mt-1.5 text-[15px] text-slate-500">
          Your path to great opportunities starts with AI interviews.
        </p>
      </div>

      {/* Right Avatar */}
      {userData.picture ? (
        <div
          className="
          ml-5
          shrink-0
          rounded-full
          ring-2
          ring-blue-100
          ring-offset-2
        "
        >
          <Image
            src={userData.picture}
            alt="userAvatar"
            width={58}
            height={58}
            className="rounded-full object-cover"
          />
        </div>
      ) : (
        <div
          className="
          ml-5
          flex
          h-[58px]
          w-[58px]
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-blue-50
          ring-2
          ring-blue-100
          ring-offset-2
        "
        >
          <span className="text-base font-semibold text-blue-600">
            {userData.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}

export default WelcomeContainer;
