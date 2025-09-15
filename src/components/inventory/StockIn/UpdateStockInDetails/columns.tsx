"use client";

import { ColumnDef } from "@tanstack/react-table";

export type StockIn = {
  id: string;     
  name: string; 
  category: string[]; 
  quantity: number;
};

export function getStockInColumns(): ColumnDef<StockIn>[] {
  return [
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
  ];
}