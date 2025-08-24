"use client"
 
import { ColumnDef } from "@tanstack/react-table"
//import { ReferrerEnum } from "next/dist/lib/metadata/types/metadata-types"
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  branch: string
  role: "STAFF" | "ADMIN"
  status: "ACTIVE" | "INACTIVE"
}
 
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
  },
  {
    accessorKey: "branch",
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
 


]