"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SideBarOptions } from "@/services/Constants";
import { LogOutIcon, Plus } from "lucide-react";
import { UserAuth } from "@/context/AuthContext";

export function AppSidebar() {
  const router = useRouter();
  const path = usePathname();
  const { signOut } = UserAuth();

  return (
    <Sidebar className="border-r border-slate-200/70 bg-white/95 backdrop-blur-xl">
      {/* Premium Logo */}
      <SidebarHeader className="relative flex items-center justify-center px-4 py-5">
        {/* Soft Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 to-transparent pointer-events-none" />

        <Image
          src="/logo.png"
          alt="Logo"
          width={160}
          height={160}
          className="relative z-10 w-[160px] object-contain"
          priority
        />
      </SidebarHeader>

      {/* Create Interview Button */}
      <div className="px-3 pb-2">
        <Button
          className="
            h-10
            w-full
            rounded-lg
            bg-slate-950
            text-white
            hover:bg-slate-800
            shadow-[0_8px_24px_rgba(15,23,42,0.10)]
            hover:shadow-[0_12px_28px_rgba(15,23,42,0.14)]
            transition-all
            duration-300
            cursor-pointer
            font-medium
            text-sm
          "
          onClick={() => router.push("/recruiter/dashboard/create-interview")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Interview
        </Button>
      </div>

      {/* Sidebar Navigation */}
      <SidebarContent className="px-2.5 pt-1">
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {SideBarOptions.map((option, index) => {
              const isActive = path === option.path;

              return (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    className={`
                      h-10
                      rounded-lg
                      px-3
                      transition-all
                      duration-300
                      border
                      ${
                        isActive
                          ? "bg-blue-50 border-blue-100 shadow-sm"
                          : "border-transparent hover:bg-slate-50 hover:border-slate-100"
                      }
                    `}
                  >
                    <Link
                      href={option.path}
                      className="flex items-center gap-3"
                    >
                      <option.icon
                        className={`
                          h-4.5
                          w-4.5
                          transition-colors
                          ${isActive ? "text-blue-600" : "text-slate-500"}
                        `}
                      />

                      <span
                        className={`
                          text-[14px]
                          font-medium
                          transition-colors
                          ${isActive ? "text-blue-700" : "text-slate-700"}
                        `}
                      >
                        {option.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-slate-100 p-3">
        <Button
          variant="outline"
          className="
            h-10
            rounded-lg
            border-slate-200
            bg-white
            text-slate-700
            hover:bg-slate-50
            hover:border-slate-300
            transition-all
            duration-300
            cursor-pointer
            font-medium
            text-sm
          "
          onClick={async () => {
            await signOut();
            router.push("/login");
          }}
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
