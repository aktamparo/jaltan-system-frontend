"use client";

import { User } from "@/lib/types/account";
import { ColumnDef } from "@tanstack/react-table";
//import { ReferrerEnum } from "next/dist/lib/metadata/types/metadata-types"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "employee.firstName",
    header: "First Name",
  },
  {
    accessorKey: "employee.lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "employee.contactNumber",
    header: "Contact Number",
  },
  {
    accessorKey: "employee.branch.name",
    header: "Branch",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
