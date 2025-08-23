"use client";

import { useState } from "react";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Modal, {
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter
} from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { columns as ViewColumns, type User } from "../../../components/ui/userViewComponents/columns";
import { DataTable as ViewTable } from "../../../components/ui/userViewComponents/user-view-table";
import { getColumns as EditColumns } from "../../../components/ui/userEditComponents/columns";
import { DataTable as EditTable } from "../../../components/ui/userEditComponents/user-view-table";
import React from "react";
export default function SettingsPage() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  
  const [showViewTable, setShowViewTable] = useState(false);
  const [showEditTable, setShowEditTable] = useState(false);
  const [showCreateUser, setCreateUser] = useState(false);
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
    ];
  
  return (
    <div className="flex flex-col justify-start mb-4">
      <h1 className="text-xl font-medium m-0">Settings</h1>

      <div className="w-full py-4 flex flex-col gap-0">
        <div className="text-lg font-medium justify-start">
          Admin Settings
        </div>
        <div className="w-full h-full justify-start p-6 space-y-2">
          <Button
            onClick={() => setShowViewTable(true)}
            className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
          >
            <span className="text-s text-black">Show All Users</span>
            <span className="text-s text-gray-500">
              Showcases all users
            </span>
          </Button>
          
          <Modal
            isVisible={showViewTable}
            onClose={() => setShowViewTable(false)}
          >
            <ModalHeader>
              <ModalTitle>Users</ModalTitle>
              <ModalDescription>
                i miss her badly
              </ModalDescription>
            </ModalHeader>
            
            <ModalContent>
             <div className="w-full py-10">
                     <ViewTable columns={ViewColumns} data={data} />
                   </div>
            </ModalContent>
            
            <ModalFooter>
              <Button type="submit">
                Save
              </Button>
            </ModalFooter>
          </Modal>

          <Button
            onClick={() => setShowEditTable(true)}
            className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
          >
            <span className="text-s text-black">Edit User</span>
            <span className="text-s text-gray-500">
              Modify a user's information
            </span>
          </Button>
          
          <Modal
            isVisible={showEditTable}
            onClose={() => setShowEditTable(false)}
          >
            <ModalHeader>
              <ModalTitle>Update User Information</ModalTitle>
              <ModalDescription>
                Suicidal tendancies reaching an all time high
              </ModalDescription>
            </ModalHeader>
            
            <ModalContent>
              <div className="w-full py-10">
                      <EditTable columns={EditColumns(selectedId, setSelectedId)} data={data} />
                    </div>
                    <Button type="submit" className="" >
                              Edit
                    </Button>
            </ModalContent>
            
            <ModalFooter>
              <Button type="submit">
                Update
              </Button>
            </ModalFooter>
          </Modal>

          <Button
            onClick={() => setCreateUser(true)}
            className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
          >
            <span className="text-s text-black">Create User</span>
            <span className="text-s text-gray-500">
              Add a new user to the system
            </span>
          </Button>
          
          <Modal
            isVisible={showCreateUser}
            onClose={() => setCreateUser(false)}
          >
            <ModalHeader>
              <ModalTitle>Create a new user</ModalTitle>
              <ModalDescription>
                Suicidal tendancies reaching an all time high


              </ModalDescription>
            </ModalHeader>
            
            <ModalContent>
              <div className="space-y-2">
                  <Label htmlFor="newFirstName">First Name</Label>
                  <Input id="newFirstName" type="text" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newLastName">Last Name</Label>
                  <Input id="newLastName" type="text" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newEmail">Email</Label>
                  <Input id="newEmail" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newContactNumber">Contact Number</Label>
                  <Input id="newContactNumber" type="text" required />
                </div>
                
            </ModalContent>
            
            <ModalFooter>
              <Button type="submit">
                Create
              </Button>
            </ModalFooter>
          </Modal>
          
        </div>
        <div className="text-lg font-medium justify-start">
          Account Settings
        </div>
        <div className="w-full h-full justify-start p-6 space-y-2">
          <Button
            onClick={() => setShowChangePassword(true)}
            className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
          >
            <span className="text-s text-black">Change Password</span>
            <span className="text-s text-gray-500">
              Update your password to keep your account secure
            </span>
          </Button>
          
          <Modal
            isVisible={showChangePassword}
            onClose={() => setShowChangePassword(false)}
          >
            <ModalHeader>
              <ModalTitle>Change Password</ModalTitle>
              <ModalDescription>
                Update your password to keep your account secure
              </ModalDescription>
            </ModalHeader>
            
            <ModalContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" required />
                </div>
                
              </div>
            </ModalContent>
            
            <ModalFooter>
              <Button type="submit">
                Save
              </Button>
            </ModalFooter>
          </Modal>

          <Button
            onClick={() => setShowPersonalDetails(true)}
            className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
          >
            <span className="text-s text-black">Update Personal Details</span>
            <span className="text-s text-gray-500">
              Modify your name, contact number, and branch assignment
            </span>
          </Button>
          
          <Modal
            isVisible={showPersonalDetails}
            onClose={() => setShowPersonalDetails(false)}
          >
            <ModalHeader>
              <ModalTitle>Update Personal Details</ModalTitle>
              <ModalDescription>
                Modify your name, contact number, and contact number
              </ModalDescription>
            </ModalHeader>
            
            <ModalContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input id="firstname" type="text" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input id="lastname" type="text" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input id="lastname" type="text" required />
                </div>
              </div>
            </ModalContent>
            
            <ModalFooter>
              <Button type="submit">
                Update
              </Button>
            </ModalFooter>
          </Modal>

          <Button
            className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
          >
            <span className="text-s text-black">View Login Activity</span>
            <span className="text-s text-gray-500">
              See recent login sessions and detect unusual activity
            </span>
          </Button>
          
        </div>

        <div className="text-lg font-medium justify-start">Jaltan Branch</div>
        <div className="w-full h-full justify-start p-6">
          <Card className="ml-6 h=10 w=full gap-1 bg-transparent border-none shadow-none p-0">
            <CardTitle className="text-s">Branch Information</CardTitle>
            <CardDescription className="text-s text-gray-500">
              You are currently managing: chuchu
            </CardDescription>
          </Card>
        </div>
      </div>
    </div>
  );
}