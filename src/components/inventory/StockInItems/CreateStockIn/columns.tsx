"use client";

import { ColumnDef } from "@tanstack/react-table";

export type StockIn = {
  id: string;     
  name: string; 
  category: string[]; 
  quantity: number;
};

export function getStockInColumns(
  selectedId: string | null,
  setSelectedId: (id: string) => void
): ColumnDef<StockIn>[] {
  return [
    {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <input
          type="radio"
          name="stockin-radio"
          checked={selectedId === row.original.id}
          onChange={() => setSelectedId(row.original.id)}
        />
      ),
    },
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
      cell: ({ row }) => row.original.category.join(", "),
    },
  ];
}

