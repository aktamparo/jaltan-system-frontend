"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type User } from "@/components/ui/userEditComponents/columns";

interface EditUserProps {
  user: User;
  onClose: () => void;
}

export default function EditUser({ user, onClose }: EditUserProps) {
  const [email, setEmail] = useState(user.email);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [contactNumber, setContactNumber] = useState(user.contactNumber);
  const [branch, setBranch] = useState(user.branch);
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input id="contactNumber" value={contactNumber} onChange={e => setContactNumber(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="branch">Branch</Label>
        <Input id="branch" value={branch} onChange={e => setBranch(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          value={role}
          onChange={e => setRole(e.target.value as "STAFF" | "ADMIN")}
          className="w-full border rounded px-2 py-1"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="STAFF">STAFF</option>
        </select>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={status}
          onChange={e => setStatus(e.target.value as "ACTIVE" | "INACTIVE")}
          className="w-full border rounded px-2 py-1"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
      </div>
    </form>
  );
}