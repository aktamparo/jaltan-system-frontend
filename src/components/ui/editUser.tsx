"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/lib/types/account";
import { AllBranches, Branch } from "@/lib/types/branch";
import { useUpdateUser } from "@/lib/mutations/accountMutations";
import { useQueryClient } from "@tanstack/react-query";

interface EditUserProps {
  user: User;
  onClose: () => void;
  data: AllBranches;
}

export default function EditUser({ user, onClose, data }: EditUserProps) {
  const updateUserMutation = useUpdateUser();

  const [email, setEmail] = useState(user.email);
  const [firstName, setFirstName] = useState(user.employee.firstName);
  const [lastName, setLastName] = useState(user.employee.lastName);
  const [contactNumber, setContactNumber] = useState(
    user.employee.contactNumber
  );
  const [branch, setBranch] = useState(user.employee.branch.name);
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);
  const queryClient = useQueryClient();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateUserMutation.mutate(
      {
        id: user.id,
        email,
        role,
        status,
        employee: {
          firstName,
          lastName,
          contactNumber,
          branch: { name: branch },
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["accounts"] });
          onClose();
        },
        onError: (err: unknown) => {
          console.error("Update failed:", err);
          alert("Failed to update user");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />
      </div>
      <select id="branch" className="w-full border rounded px-2 py-1">
        {(data.data ?? []).map((branch: Branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as "STAFF" | "ADMIN")}
          className="w-full border rounded px-2 py-1"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="STAFF">STAFF</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE")}
          className="w-full border rounded px-2 py-1"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" onClick={onClose} variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
