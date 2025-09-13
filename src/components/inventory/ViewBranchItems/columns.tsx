"use client";

import { ColumnDef } from "@tanstack/react-table";

export type InventoryItem = {
    name: string;
    category: string[];
    quantity: number;
    modifiedAt: string;
  };

export const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "name",
    header: "Item Name",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "modifiedAt",
    header: "Last Updated",
  },
];

