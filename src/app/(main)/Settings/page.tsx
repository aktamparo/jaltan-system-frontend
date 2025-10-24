"use client";
import ViewBranch from "@/components/ui/branchMangementModals/viewBranch";

import CreateBranch from "@/components/ui/branchMangementModals/createBranch";
import ChangePassword from "@/components/ui/ChangePassword";
import UpdateDetails from "@/components/ui/UpdateDetails";
import ViewLogin from "@/components/ui/ViewLogin";
import ViewUsers from "@/components/ui/ViewUsers";
import AddUser from "@/components/ui/AddUser";
import EditRole from "@/components/ui/EditRole";
import EditBranch from "@/components/ui/branchMangementModals/editBranch";
import AddUOMType from "@/components/ui/uomManagementSettings/AddUOMType";
import AddUOM from "@/components/ui/uomManagementSettings/AddUOM";
import ViewUOMType from "@/components/ui/uomManagementSettings/ViewUOMType";
import ViewUOM from "@/components/ui/uomManagementSettings/ViewUOM";
import EditUOMType from "@/components/ui/uomManagementSettings/EditUOMType";
import CreateItem from "@/components/ui/itemManagementModals/CreateItem";
import ViewItem from "@/components/ui/itemManagementModals/ViewItem";
import EditItem from "@/components/ui/itemManagementModals/EditItem";
import EditUOM from "@/components/ui/uomManagementSettings/EditUOM";
import ScrollableComponent from "@/components/ui/scrollableComponent";
import React from "react";
import { useGetAccount } from "@/lib/queries/accountQueries";
// // import type { Branch } from "@/components/ui/branchMangementModals/branchViewDetails/columns";
// import EditBranch from "@/components/ui/branchMangementModals/editBranch";
export default function SettingsPage() {
  const { data: currentUser, isLoading: isLoadingCurrentAccount } =
    useGetAccount();
  if (isLoadingCurrentAccount) return <p>Loading...</p>;
  // const { data: AllBranches, isLoading: isLoadingAllBranches } = useGetAllBranches();
  // const { data: AllUsers, isLoading: isLoadingAllAccounts } =
  // useGetAllAccounts();
  // if (isLoadingAllAccounts) return <p>Loading...</p>;

  // if (isLoadingAllBranches) return <p>Loading...</p>;

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <ScrollableComponent>
        <h1 className="text-xl font-medium m-0 mb-4">Settings</h1>

        <div className="w-full py-4 flex flex-col gap-0">
          <div className="text-lg font-medium justify-start">
            Account Settings
          </div>
          <div className="w-full h-full justify-start p-6 space-y-2">
            <ChangePassword />
            <UpdateDetails />
          
          </div>

          {currentUser?.role === "ADMIN" && (
            <>
              <div className="text-lg font-medium justify-start">
                User Management Settings
              </div>
              <div className="w-full h-full justify-start p-6 space-y-2">
                <AddUser />
                <EditRole />
                <ViewUsers />
              </div>
              <div className="text-lg font-medium justify-start">
                Branch Management Settings
              </div>
              <div className="w-full h-full justify-start p-6 space-y-2">
                <CreateBranch />
                <EditBranch />
                <ViewBranch />
                
              </div>

              <div className="text-lg font-medium justify-start">
                Unit of Measurement Type Management Settings
              </div>

              <div className="w-full h-full justify-start p-6 space-y-2">
                <AddUOMType />
                <EditUOMType />
                <ViewUOMType />
                
              </div>

              <div className="text-lg font-medium justify-start">
                Unit of Measurement Management Settings
              </div>
              <div className="w-full h-full justify-start p-6 space-y-2">
                <AddUOM />
                <EditUOM />
                <ViewUOM />
                
              </div>
              
              <div className="text-lg font-medium justify-start">
                Master Item Settings
              </div>
              <div className="w-full h-full justify-start p-6 space-y-2">
                <CreateItem />
                <ViewItem />
                <EditItem />
              </div>
            </>
          )}
        </div>
      </ScrollableComponent>
    </div>
  );
}
