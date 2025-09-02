"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Branch } from "@/components/ui/branchMangementModals/branchViewDetails/columns";
// import { useUpdateUser } from "@/lib/mutations/accountMutations";
// import { useQueryClient } from "@tanstack/react-query";

interface EditBranchModalProps {
  branch: Branch;
  onClose: () => void;
}

export default function EditBranchModal({
  branch,
  onClose,
}: EditBranchModalProps) {
  // For frontend testing, initialize with branch data if available
  const [name, setName] = useState(branch.name || "");
  const [street, setStreet] = useState(branch.street || "");
  const [city, setCity] = useState(branch.city || "");
  const [province, setProvince] = useState(branch.province || "");
  const [zipCode, setZipCode] = useState(branch.zipCode || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For frontend testing, just log the values and close
    console.log("Form submitted:", {
      name,
      street,
      city,
      province,
      zipCode,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="name">Branch Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="street">Street</Label>
        <Input
          id="street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="province">Province</Label>
        <Input
          id="province"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="zipCode">Zip Code</Label>
        <Input
          id="zipCode"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
        />
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
