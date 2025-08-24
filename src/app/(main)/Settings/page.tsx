"use client";

import ChangePassword from "@/components/ui/ChangePassword";
import UpdateDetails from "@/components/ui/UpdateDetails";
import ViewLogin from "@/components/ui/ViewLogin"
import BranchInfo from "@/components/ui/BranchInfo";
import ViewAllUsers from "@/components/ui/viewAllUsers";
import AddUser from "@/components/ui/AddUser";
import EditUser from "@/components/ui/editUserTable";
import EditUserTable from "@/components/ui/editUserTable";
import { columns as ViewColumns, type User } from "../../../components/ui/userViewComponents/columns";

import React from "react";
interface SettingsPageProps {
  user?: {
    id: "string"
    email: "string",
    firstName: "string",
    lastName: "string",
    contactNumber: "string",
    role: "ADMIN | STAFF",
    status: "ACTIVE | INACTIVE"
  };
}


export default function SettingsPage({user}: SettingsPageProps) {

  const isDevelopment = process.env.NODE_ENV === 'development';
  const User = {
      id: "234567789",
      email: "m@example.com",
      firstname: "Mark",
      lastname: "Iglesias",
      contactNumber: "23456789",
      role: "ADMIN",
      status: "ACTIVE"

    };

    const currentUser = user || (isDevelopment ? User : null);

  if (!currentUser) {
    return <div></div>;
  }
  
 const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const data: User[] = [
    {
      id: "728ed52f",
      email: "m@example.com",
      firstName: "Mark",
      lastName: "Iglesias",
      contactNumber: "09123456789",
      branch: "Main Branch",
      role: "STAFF",
      status: "ACTIVE",
    },
    {
      id: "728ed52g",
      email: "jane@example.com",
      firstName: "Jane",
      lastName: "Smith",
      contactNumber: "09998887777",
      branch: "Branch 2",
      role: "ADMIN",
      status: "INACTIVE",
    },
  ]


  return (
    <div>
      {currentUser?.role === "STAFF" && (
        <div className="flex flex-col justify-start mb-4">
          <h1 className="text-xl font-medium m-0">Settings</h1>

          <div className="w-full py-4 flex flex-col gap-0">
            <div className="text-lg font-medium justify-start">
              Account Settings
            </div>
            <div className="w-full h-full justify-start p-6 space-y-2">
              <ChangePassword/>
              <UpdateDetails/>
              <ViewLogin/>
            </div>

            <div className="text-lg font-medium justify-start">Jaltan Branch</div>
            <div className="w-full h-full justify-start p-6">
              <BranchInfo/>
            </div>
          </div>
        </div>
      )}

      {currentUser.role === "ADMIN" && (
        <div className="flex flex-col justify-start mb-4">
          <h1 className="text-xl font-medium m-0">Settings</h1>

          <div className="w-full py-4 flex flex-col gap-0">
            <div className="text-lg font-medium justify-start">
              Account Settings
            </div>
            <div className="w-full h-full justify-start p-6 space-y-2">
              <ChangePassword/>
              <UpdateDetails/>
              <ViewLogin/>
            </div>

            <div className="text-lg font-medium justify-start">
              User Management Settings
            </div>
            <div className="w-full h-full justify-start p-6 space-y-2">
              <ViewAllUsers data={data} />
              <EditUserTable data={data} />

            </div>
          </div>
        </div>
      )}
</div>
    
  );
}