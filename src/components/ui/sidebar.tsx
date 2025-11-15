"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  IconPackage,
  IconTruck,
  IconReportAnalytics,
  IconMenu2,
  IconX,
  IconLogout,
  IconSettings,
  IconPackageImport, // Stock In
  IconPackageExport,   // Stock Out
  IconChartBar,        // Sales
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useLogout } from "@/lib/mutations/authMutation";
import { CurrentUser } from "@/lib/types/account";
import Link from "next/link";
import { queryClient } from "@/lib/react-query";
import LogoutConfirmationModal from "@/components/ui/LogoutConfirmationModal";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Sidebar({ account }: CurrentUser) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const logoutMutation = useLogout();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        router.push("/login");
        setShowLogoutModal(false);
      },
      onError: (err) => {
        console.error("Logout failed", err);
        setShowLogoutModal(false);
      },
    });
  };

  return (
    <>
      <div className="hidden sm:flex sm:flex-col sm:w-64 h-full bg-white border">
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
            pathname === "/stockin"
              ? "text-[#D22929]"
              : "hover:text-[#D22929]"
          }`}
        >
          <IconPackageImport
            size={20}
            className={pathname === "/stockin" ? "text-[#D22929]" : ""}
          />
          Stock In
        </Link>

        <Link
          href="/stockout"
          className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
            pathname === "/stockout"
              ? "text-[#D22929]"
              : "hover:text-[#D22929]"
          }`}
        >
          <IconPackageExport
            size={20}
            className={pathname === "/stockout" ? "text-[#D22929]" : ""}
          />
          Stock Out
        </Link>

        <Link
          href="/sales"
          className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
            pathname === "/sales"
              ? "text-[#D22929]"
              : "hover:text-[#D22929]"
          }`}
        >
          <IconChartBar
            size={20}
            className={pathname === "/sales" ? "text-[#D22929]" : ""}
          />
          Sales
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
          <button
            onClick={handleLogoutClick}
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
                pathname === "/stockin"
                  ? "text-[#D22929]"
                  : "hover:text-[#D22929]"
              }`}
            >
              <IconPackageImport
                size={20}
                className={pathname === "/stockin" ? "text-[#D22929]" : ""}
              />
              Stock In
            </Link>

            <Link
              href="/stockout"
              className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
                pathname === "/stockout"
                  ? "text-[#D22929]"
                  : "hover:text-[#D22929]"
              }`}
            >
              <IconPackageExport
                size={20}
                className={pathname === "/stockout" ? "text-[#D22929]" : ""}
              />
              Stock Out
            </Link>

            <Link
              href="/sales"
              className={`flex items-center gap-2 p-4 hover:bg-gray-50 ${
                pathname === "/sales"
                  ? "text-[#D22929]"
                  : "hover:text-[#D22929]"
              }`}
            >
              <IconChartBar
                size={20}
                className={pathname === "/sales" ? "text-[#D22929]" : ""}
              />
              Sales
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
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-2 p-4 text-s w-full text-left hover:bg-gray-50"
              >
                <IconLogout size={16} /> Logout
              </button>
            </div>
          </div>
        )}
      </div>

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}
