"use client";

import ChangePassword from "@/components/ui/ChangePassword";
import UpdateDetails from "@/components/ui/UpdateDetails";
import ViewLogin from "@/components/ui/ViewLogin"
import BranchInfo from "@/components/ui/BranchInfo";
import ViewUser from "@/components/ui/ViewUsers";
import AddUser from "@/components/ui/AddUser";
import EditRole from "@/components/ui/EditRole";

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
              <ViewUser/>
              <AddUser/>
              <EditRole/>
            </div>
          </div>
        </div>
      )}
</div>
    
  );
}