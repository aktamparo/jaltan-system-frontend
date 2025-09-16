"use client";

import { ColumnDef } from "@tanstack/react-table";

export type StockIn = {
  id: string;
  name: string;
  category: string[];
  quantity: number;
  createdAt: string;
  createdById: string;
  modifiedAt: string;
  modifiedById: string;
};

export const columns: ColumnDef<StockIn>[] = [
  {
    accessorKey: "name",
    header: "Item",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category.join(", "),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "createdById",
    header: "Created By",
  },
  {
    accessorKey: "modifiedAt",
    header: "Modified At",
  },
  {
    accessorKey: "modifiedById",
    header: "Modified By",
  },
];

