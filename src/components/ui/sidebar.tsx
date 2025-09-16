"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  IconLayoutDashboard,
  IconPackage,
  IconTruck,
  IconReportAnalytics,
  IconMenu2,
  IconX,
  IconLogout,
  IconSettings,
  IconPackageImport, // Stock In
  IconPackageExport,   // Stock Out
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { useLogout } from "@/lib/mutations/authMutation";
import { CurrentUser } from "@/lib/types/account";
import Link from "next/link";
import { queryClient } from "@/lib/react-query";

export default function Sidebar({ account }: CurrentUser) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const username = `${account.firstName} ${account.lastName}`;
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        router.push("/login");
      },
      onError: (err) => {
        console.error("Logout failed", err);
      },
    });
  };

  return (
    <>
      <div className="hidden sm:flex sm:flex-col sm:w-64 h-full bg-white border">
        <Link
          href="/dashboard"
          className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
            pathname === "/dashboard"
              ? "text-[#D22929]"
              : "hover:text-[#D22929]"
          }`}
        >
          <IconLayoutDashboard
            size={20}
            className={pathname === "/dashboard" ? "text-[#D22929]" : ""}
          />
          Dashboard
        </Link>

        <Link
          href="/inventory"
          className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
            pathname === "/inventory"
              ? "text-[#D22929]"
              : "hover:text-[#D22929]"
          }`}
        >
          <IconPackage
            size={20}
            className={pathname === "/inventory" ? "text-[#D22929]" : ""}
          />
          Inventory
        </Link>

        <Link
          href="/stockin"
          className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
            pathname === "/stock-in"
              ? "text-[#D22929]"
              : "hover:text-[#D22929]"
          }`}
        >
          <IconPackageImport
            size={20}
            className={pathname === "/stock-in" ? "text-[#D22929]" : ""}
          />
          Stock In
        </Link>

        <Link
          href="/stockout"
          className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
            pathname === "/stock-out"
              ? "text-[#D22929]"
              : "hover:text-[#D22929]"
          }`}
        >
          <IconPackageExport
            size={20}
            className={pathname === "/stock-out" ? "text-[#D22929]" : ""}
          />
          Stock Out
        </Link>

        <Link
          href="/logistics"
          className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
            pathname === "/logistics"
              ? "text-[#D22929]"
              : "hover:text-[#D22929]"
          }`}
        >
          <IconTruck
            size={20}
            className={pathname === "/logistics" ? "text-[#D22929]" : ""}
          />
          Logistics
        </Link>

        <Link
          href="/reports"
          className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
            pathname === "/reports" ? "text-[#D22929]" : "hover:text-[#D22929]"
          }`}
        >
          <IconReportAnalytics
            size={20}
            className={pathname === "/reports" ? "text-[#D22929]" : ""}
          />
          Reports
        </Link>

        <Link
          href="/settings"
          className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
            pathname === "/settings" ? "text-[#D22929]" : "hover:text-[#D22929]"
          }`}
        >
          <IconSettings
            size={20}
            className={pathname === "/settings" ? "text-[#D22929]" : ""}
          />
          Settings
        </Link>

        <div className="mt-auto">
          <div className="flex items-center gap-2 p-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback />
            </Avatar>
            <span className="font-medium">{username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-4 text-s w-full text-left hover:bg-gray-50"
          >
            <IconLogout size={16} /> Logout
          </button>
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

            <Link
              href="/dashboard"
              className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
                pathname === "/dashboard"
                  ? "text-[#D22929]"
                  : "hover:text-[#D22929]"
              }`}
            >
              <IconLayoutDashboard
                size={20}
                className={pathname === "/dashboard" ? "text-[#D22929]" : ""}
              />
              Dashboard
            </Link>

            <Link
              href="/inventory"
              className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
                pathname === "/inventory"
                  ? "text-[#D22929]"
                  : "hover:text-[#D22929]"
              }`}
            >
              <IconPackage
                size={20}
                className={pathname === "/inventory" ? "text-[#D22929]" : ""}
              />
              Inventory
            </Link>

            <Link
              href="/stockin"
              className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
                pathname === "/stock-in"
                  ? "text-[#D22929]"
                  : "hover:text-[#D22929]"
              }`}
            >
              <IconPackageImport
                size={20}
                className={pathname === "/stock-in" ? "text-[#D22929]" : ""}
              />
              Stock In
            </Link>

            <Link
              href="/stockout"
              className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
                pathname === "/stock-out"
                  ? "text-[#D22929]"
                  : "hover:text-[#D22929]"
              }`}
            >
              <IconPackageExport
                size={20}
                className={pathname === "/stock-out" ? "text-[#D22929]" : ""}
              />
              Stock Out
            </Link>

            <Link
              href="/logistics"
              className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
                pathname === "/logistics"
                  ? "text-[#D22929]"
                  : "hover:text-[#D22929]"
              }`}
            >
              <IconTruck
                size={20}
                className={pathname === "/logistics" ? "text-[#D22929]" : ""}
              />
              Logistics
            </Link>

            <Link
              href="/reports"
              className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
                pathname === "/reports"
                  ? "text-[#D22929]"
                  : "hover:text-[#D22929]"
              }`}
            >
              <IconReportAnalytics
                size={20}
                className={pathname === "/reports" ? "text-[#D22929]" : ""}
              />
              Reports
            </Link>

            <Link
              href="/settings"
              className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
                pathname === "/settings"
                  ? "text-[#D22929]"
                  : "hover:text-[#D22929]"
              }`}
            >
              <IconSettings
                size={20}
                className={pathname === "/settings" ? "text-[#D22929]" : ""}
              />
              Settings
            </Link>

            <div className="mt-auto">
              <div className="flex items-center gap-2 p-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback />
                </Avatar>
                <span className="font-medium">{username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-4 text-s w-full text-left hover:bg-gray-50"
              >
                <IconLogout size={16} /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
