"use client";

import { ColumnDef } from "@tanstack/react-table";

export type StockIn = {
  id: string;     
  name: string; 
  category: string[]; 
  quantity: number;
  uomSymbol: string;
};

export function getStockInColumns(
  selectedIds: string[],
  setSelectedIds: (ids: string[]) => void
): ColumnDef<StockIn>[] {
  return [
    {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <input
          type="checkbox"
          name="stockin-checkbox"
          checked={selectedIds.includes(row.original.id)}
          onChange={() => {
            if (selectedIds.includes(row.original.id)) {
              setSelectedIds(selectedIds.filter(id => id !== row.original.id));
            } else {
              setSelectedIds([...selectedIds, row.original.id]);
            }
          }}
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Item",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => `${row.original.quantity} ${row.original.uomSymbol ?? ""}`,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => row.original.category.join(", "),
    },
  ];
}