"use client";
import ViewBranch from "@/components/ui/branchMangementModals/viewBranch";
import type { Branch } from "@/components/ui/branchMangementModals/branchViewDetails/columns";
import EditBranch from "@/components/ui/branchMangementModals/editBranch";
import CreateBranch from "@/components/ui/branchMangementModals/createBranch";
import ChangePassword from "@/components/ui/ChangePassword";
import UpdateDetails from "@/components/ui/UpdateDetails";
import ViewLogin from "@/components/ui/ViewLogin";
import ViewUsers from "@/components/ui/ViewUsers";
import AddUser from "@/components/ui/AddUser";
import EditRole from "@/components/ui/EditRole";
import React from "react";
import { useGetAllAccounts, useGetAccount } from "@/lib/queries/accountQueries";
import { useGetAllBranches } from "@/lib/queries/branchQueries";
export default function SettingsPage() {

  const { data: AllUsers, isLoading: isLoadingAllAccounts } =
    useGetAllAccounts();
  const { data: currentUser, isLoading: isLoadingCurrentAccount } =
    useGetAccount();
  const { data: AllBranches, isLoading: isLoadingAllBranches } = useGetAllBranches();
  if (isLoadingAllAccounts) return <p>Loading...</p>;
  if (isLoadingCurrentAccount) return <p>Loading...</p>;
  if (isLoadingAllBranches) return <p>Loading...</p>;

  console.log(AllUsers);
  console.log(AllUsers);
  console.log(AllBranches);

  return (
    <div>
      <div className="flex flex-col justify-start mb-4">
        <h1 className="text-xl font-medium m-0">Settings</h1>

        <div className="w-full py-4 flex flex-col gap-0">
          <div className="text-lg font-medium justify-start">
            Account Settings
          </div>
          <div className="w-full h-full justify-start p-6 space-y-2">
            <ChangePassword />
            <UpdateDetails />
            <ViewLogin />
          </div>

          {currentUser?.role === "ADMIN" && (
            <>
              <div className="text-lg font-medium justify-start">
                User Management Settings
              </div>
              <div className="w-full h-full justify-start p-6 space-y-2">
                <ViewUsers data={AllUsers} />
                <AddUser />
                <EditRole data={AllUsers} />
              </div>
              <div className="text-lg font-medium justify-start">
                Branch Management Settings
              </div>
              <div className="w-full h-full justify-start p-6 space-y-2">
                <CreateBranch />
                <ViewBranch data={AllBranches} />
                <EditBranch data={AllBranches} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
