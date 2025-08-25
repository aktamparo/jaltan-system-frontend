"use client";

import { User } from "@/lib/types/account";
import { ColumnDef } from "@tanstack/react-table";

export function getColumns(
  selectedId: string | null,
  setSelectedId: (id: string) => void
): ColumnDef<User>[] {
  return [
    {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <input
          type="radio"
          name="user-radio"
          checked={selectedId === row.original.id}
          onChange={() => setSelectedId(row.original.id)}
        />
      ),
    },
    {
      header: "First Name",
      accessorFn: (row) => row.employee?.firstName,
    },
    {
      header: "Last Name",
      accessorFn: (row) => row.employee?.lastName,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      header: "Contact Number",
      accessorFn: (row) => row.employee?.contactNumber,
    },
    {
      header: "Branch",
      accessorFn: (row) => row.employee?.branch?.name,
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
}
