"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Camera, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RecruiterProfile() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: "",
    email: "",
    picture: null,
  });
  const [originalData, setOriginalData] = useState({});
  const [password, setPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  let provider = null;
  if (typeof window !== "undefined") {
    try {
      provider = JSON.parse(
        localStorage.getItem("sb-oqaqnjpovruuqpuohjbp-auth-token"),
      )?.user?.app_metadata?.provider;
    } catch {}
  }
  const isGoogleUser = provider === "google";

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      setLoading(true);

      // Get user data from Provider context
      let userData = {
        fullname: user?.name || user?.email?.split("@")[0] || "",
        email: user?.email || "",
        picture: user?.picture || null,
      };

      // Try to get additional data from users table
      if (user?.email) {
        const { data: userRecord, error } = await supabase
          .from("users")
          .select("name, email, picture")
          .eq("email", user.email)
          .single();

        if (!error && userRecord) {
          userData = {
            ...userData,
            fullname: userRecord.name || userData.fullname,
            email: userRecord.email || userData.email,
            picture: userRecord.picture || userData.picture,
          };
        }
      }

      setProfileData(userData);
      setOriginalData(userData);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setSaving(true);

      // Upload to Supabase storage
      const fileName = `profile-${user.email}-${Date.now()}`;
      const { data, error } = await supabase.storage
        .from("profile-pictures")
        .upload(fileName, file);

      if (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image");
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(fileName);

      const newPictureUrl = urlData.publicUrl;

      // Update local state
      setProfileData((prev) => ({
        ...prev,
        picture: newPictureUrl,
      }));

      // Immediately save to database
      const { error: updateError } = await supabase.from("users").upsert(
        {
          email: user.email,
          name: profileData.fullname,
          picture: newPictureUrl,
        },
        {
          onConflict: "email",
        },
      );

      if (updateError) {
        console.error("Database update error:", updateError);
        toast.error("Failed to save picture to database");
        return;
      }

      // Update original data to reflect the change
      setOriginalData((prev) => ({
        ...prev,
        picture: newPictureUrl,
      }));

      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!user?.email) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setSaving(true);

      // Update users table
      const { error } = await supabase.from("users").upsert(
        {
          email: user.email,
          name: profileData.fullname,
          picture: profileData.picture,
        },
        {
          onConflict: "email",
        },
      );

      if (error) {
        console.error("Update error:", error);
        toast.error("Failed to update profile");
        return;
      }

      setOriginalData(profileData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!password) return;
    setPasswordSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.error("Failed to change password");
      } else {
        toast.success("Password changed successfully!");
        setPassword("");
      }
    } catch (e) {
      toast.error("Error changing password");
    } finally {
      setPasswordSaving(false);
    }
  };

  const hasChanges = () => {
    return JSON.stringify(profileData) !== JSON.stringify(originalData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Profile Settings
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Manage your personal information and profile picture
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Profile Picture Section */}
        <Card className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Camera className="w-4 h-4 text-blue-600" />
              Profile Picture
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-20 h-20 border-4 border-slate-100 shadow-sm">
                <AvatarImage src={profileData.picture} alt="Profile" />

                <AvatarFallback className="text-xl bg-blue-50 text-blue-600 font-semibold">
                  {profileData.fullname?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col items-center space-y-2">
                <Label htmlFor="picture-upload" className="cursor-pointer">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-9 rounded-xl border-slate-200 hover:bg-slate-50"
                  >
                    <span>
                      <Camera className="w-3.5 h-3.5 mr-2" />
                      Change Picture
                    </span>
                  </Button>
                </Label>

                <input
                  id="picture-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePictureUpload}
                  className="hidden"
                />

                {saving && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Uploading...
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="fullname" className="text-sm">
                  Full Name
                </Label>

                <Input
                  id="fullname"
                  value={profileData.fullname}
                  onChange={(e) =>
                    handleInputChange("fullname", e.target.value)
                  }
                  placeholder="Enter your full name"
                  className="h-10 rounded-xl border-slate-200 text-sm"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm">
                  Email Address
                </Label>

                <Input
                  id="email"
                  value={profileData.email}
                  placeholder="Enter your email"
                  type="email"
                  disabled
                  className="h-10 rounded-xl border-slate-200 text-sm bg-slate-50"
                />

                <p className="text-[11px] text-slate-500 mt-1">
                  Email cannot be changed for security reasons
                </p>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={!hasChanges() || saving}
              className="
              h-10
              w-full
              rounded-xl
              bg-slate-950
              hover:bg-slate-800
              text-sm
              shadow-[0_8px_24px_rgba(15,23,42,0.08)]
            "
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4 text-blue-600" />
              Security
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-sm py-2">
                Change Password
              </Label>

              <Input
                id="password"
                type="password"
                value={
                  isGoogleUser
                    ? "You can't change the password because you login with Google OAuth"
                    : password
                }
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isGoogleUser ? "" : "Enter new password"}
                disabled={isGoogleUser || passwordSaving}
                className="h-10 rounded-xl border-slate-200 text-sm"
              />

              {isGoogleUser && (
                <p className="text-[11px] text-slate-500 mt-1">
                  You can&apos;t change the password because you login with
                  Google OAuth
                </p>
              )}
            </div>

            <Button
              onClick={handlePasswordChange}
              disabled={isGoogleUser || !password || passwordSaving}
              className="
              h-10
              w-full
              rounded-xl
              bg-slate-950
              hover:bg-slate-800
              text-sm
              shadow-[0_8px_24px_rgba(15,23,42,0.08)]
            "
            >
              {passwordSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card className="rounded-2xl border border-slate-200/70 bg-white/90 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="w-4 h-4 text-blue-600" />
            Account Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-xs font-medium text-slate-500">
                Account Type
              </Label>

              <p className="text-sm text-slate-900 mt-1">Recruiter</p>
            </div>

            <div>
              <Label className="text-xs font-medium text-slate-500">
                Member Since
              </Label>

              <p className="text-sm text-slate-900 mt-1">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
