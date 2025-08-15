"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react"
import { IconLayoutDashboard, IconPackage, IconTruck, IconReportAnalytics, IconMenu2, IconX, IconLogout, IconSettings } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"; 

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [username] = useState("User");
  const pathname = usePathname(); 

  return (
    <>
      <div className="hidden sm:flex sm:flex-col sm:w-64 h-full bg-white border">
        <a 
          href="/dashboard" 
          className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
            pathname === "/dashboard" ? "text-[#D22929]" : "hover:text-[#D22929]"
          }`}
        >
          <IconLayoutDashboard size={20} className={pathname === "/dashboard" ? "text-[#D22929]" : ""} /> 
          Dashboard
        </a>
        <a 
          href="/inventory" 
          className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
            pathname === "/inventory" ? "text-[#D22929]" : "hover:text-[#D22929]"
          }`}
        >
          <IconPackage size={20} className={pathname === "/inventory" ? "text-[#D22929]" : ""} /> 
          Inventory
        </a>
        <a 
          href="/logistics" 
          className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
            pathname === "/logistics" ? "text-[#D22929]" : "hover:text-[#D22929]"
          }`}
        >
          <IconTruck size={20} className={pathname === "/logistics" ? "text-[#D22929]" : ""} /> 
          Logistics
        </a>
        <a 
          href="/reports" 
          className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
            pathname === "/reports" ? "text-[#D22929]" : "hover:text-[#D22929]"
          }`}
        >
          <IconReportAnalytics size={20} className={pathname === "/reports" ? "text-[#D22929]" : ""} /> 
          Reports
        </a>

        <a 
          href="/settings" 
          className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
            pathname === "/reports" ? "text-[#D22929]" : "hover:text-[#D22929]"
          }`}
        >
          <IconSettings size={20} className={pathname === "/settings" ? "text-[#D22929]" : ""} /> 
          Settings
        </a>

        <div className="mt-auto">
          <div className="flex items-center gap-2 p-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <span className="font-medium">{username}</span>
          </div>
          <a href="/login" className="flex items-center gap-2 p-4 text-s">
            <IconLogout size={16} /> Logout
          </a>
        </div>
      </div>

      <div className="sm:hidden relative">
        {!isOpen && (
          <div className="p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="p-4"
            >
              <IconMenu2 size={20} />
            </Button>
          </div>
        )}

        {isOpen && (
          <div className="h-full w-64 bg-white border flex flex-col">
            <div className="flex justify-start p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-2"
              >
                <IconX size={20} />
              </Button>
            </div>

            <a 
              href="/dashboard" 
              className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
                pathname === "/dashboard" ? "text-[#D22929]" : "hover:text-[#D22929]"
              }`}
            >
              <IconLayoutDashboard size={20} className={pathname === "/dashboard" ? "text-[#D22929]" : ""} /> 
              Dashboard
            </a>
            <a 
              href="/inventory" 
              className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
                pathname === "/inventory" ? "text-[#D22929]" : "hover:text-[#D22929]"
              }`}
            >
              <IconPackage size={20} className={pathname === "/inventory" ? "text-[#D22929]" : ""} /> 
              Inventory
            </a>
            <a 
              href="/logistics" 
              className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
                pathname === "/logistics" ? "text-[#D22929]" : "hover:text-[#D22929]"
              }`}
            >
              <IconTruck size={20} className={pathname === "/logistics" ? "text-[#D22929]" : ""} /> 
              Logistics
            </a>
            <a 
              href="/reports" 
              className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
                pathname === "/reports" ? "text-[#D22929]" : "hover:text-[#D22929]"
              }`}
            >
              <IconReportAnalytics size={20} className={pathname === "/reports" ? "text-[#D22929]" : ""} /> 
              Reports
            </a>
            <a 
            href="/settings" 
            className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
                pathname === "/settings" ? "text-[#D22929]" : "hover:text-[#D22929]"
            }`}
            >
            <IconSettings size={20} className={pathname === "/settings" ? "text-[#D22929]" : ""} /> 
            Settings
            </a>

            <div className="mt-auto">
              <div className="flex items-center gap-2 p-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
                <span className="font-medium">{username}</span>
              </div>
              <a href="/login" className="flex items-center gap-2 p-4 text-s">
                <IconLogout size={16} /> Logout
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
