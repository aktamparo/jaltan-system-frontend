"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Branch } from "@/lib/types/branch";
import { useCreateUser } from "@/lib/mutations/accountMutations";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAllBranches } from "@/lib/queries/branchQueries";
import { useToast } from "@/components/ui/toast";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";

export default function AddUser() {
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [branchId, setBranchId] = useState("");
  const [role, setRole] = useState<"ADMIN" | "STAFF">("STAFF");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const { data: AllBranches } = useGetAllBranches(1, 100);
  const createUser = useCreateUser();
  const queryClient = useQueryClient();
  const toast = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser.mutate(
      {
        email,
        password,
        role,
        status,
        firstName,
        lastName,
        contactNumber,
        branchId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["accounts"] });
          setEmail("");
          setPassword("");
          setFirstName("");
          setLastName("");
          setContactNumber("");
          setBranchId("");
          setRole("STAFF");
          setStatus("ACTIVE");
          setShowCreateUser(false);
          toast.success(
            "User Created",
            "New user has been successfully created."
          );
        },
        onError: (err: unknown) => {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to create user";

          toast.error("User Creation Failed", errorMessage);
        },
      }
    );
  };
  return (
    <>
      <Button
        onClick={() => setShowCreateUser(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">Create User</span>
        <span className="text-s text-gray-500">
          Register a new branch manager or authorized staff into the system
        </span>
      </Button>

      <Modal
        isVisible={showCreateUser}
        onClose={() => setShowCreateUser(false)}
      >
        <ModalHeader>
          <ModalTitle>Create User</ModalTitle>
          <ModalDescription>
            Fill in the details to create a new user account
          </ModalDescription>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <select
                  id="branch"
                  className="w-full border rounded px-2 py-1"
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a branch
                  </option>
                  {(AllBranches?.data ?? []).map((branch: Branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="w-full border rounded px-2 py-1"
                  value={role}
                  onChange={(e) => setRole(e.target.value as "ADMIN" | "STAFF")}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="STAFF">STAFF</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="w-full border rounded px-2 py-1"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "ACTIVE" | "INACTIVE")
                  }
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>
          </ModalContent>

          <ModalFooter>
            <div className="flex flex-col w-full gap-4 mt-6">
              <Button className="self-end" type="submit">
                Save
              </Button>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
