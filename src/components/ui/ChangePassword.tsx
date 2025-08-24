"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { z, ZodError } from "zod";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(8, "Password cannot exceed 8 characters"),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ChangePassword() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState<Partial<PasswordFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof PasswordFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    try {
      passwordSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<PasswordFormData> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            const path = issue.path[0] as keyof PasswordFormData;
            newErrors[path] = issue.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log("Password change submitted:", formData);
      setShowChangePassword(false);
      setFormData({ currentPassword: "", newPassword: "" });
    }
  };

  const handleClose = () => {
    setShowChangePassword(false);
    setFormData({ currentPassword: "", newPassword: "" });
    setErrors({});
  };

  return (
    <>
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
        onClose={handleClose}
      >
        <ModalHeader>
          <ModalTitle>Change Password</ModalTitle>
          <ModalDescription>
            Update your password to keep your account secure
          </ModalDescription>
        </ModalHeader>
        
        <form onSubmit={handleSubmit}>
          <ModalContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword"
                  name="currentPassword"
                  type="password" 
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                />
                {errors.currentPassword && (
                  <p className="text-sm text-red-500">{errors.currentPassword}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword"
                  name="newPassword" 
                  type="password" 
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword}</p>
                )}
                <p className="text-xs text-gray-500">Password must be exactly 8 characters</p>
              </div>
            </div>
          </ModalContent>
          
          <ModalFooter>
            <Button className="mt-4"
            type="submit">
              Save
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}