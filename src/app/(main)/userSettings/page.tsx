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


export default function UserSettingsPage() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  

  return (
    <div className="flex flex-col justify-start mb-4">
      <h1 className="text-xl font-medium m-0">Settings</h1>

      <div className="w-full py-4 flex flex-col gap-0">
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
                Modify your name, contact number, and branch assignment
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