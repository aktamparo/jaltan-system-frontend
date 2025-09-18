// components/inventory/stock-out/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";

// Define StockOut locally for UI development
export type StockOut = {
  id: string;
  name: string;
  category: string[];
  quantity: number;
  createdAt: string;
  createdById: string;
  modifiedAt: string;
  modifiedById: string;
};

export const stockOutColumns: ColumnDef<StockOut>[] = [
  {
    accessorKey: "name",
    header: "Item Name",
    cell: ({ row }) => {
      return <span>{row.original.name}</span>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      return (
        <span className="font-medium">
          {Number(row.original.quantity).toFixed(2)}
        </span>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const categories = row.original.category;
      return (
        <div className="flex gap-1">
          {categories.map((cat, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                cat === "FRIDGE"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "createdById",
    header: "Created By",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-gray-600">
          {row.original.createdById}
        </span>
      );
    },
  },
  {
    accessorKey: "modifiedAt",
    header: "Modified At",
    cell: ({ row }) => {
      const date = new Date(row.original.modifiedAt);
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "modifiedById",
    header: "Modified By",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-gray-600">
          {row.original.modifiedById}
        </span>
      );
    },
  },
];
