"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InventoryItem } from "@/lib/types/inventory";

export const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "masterItem.name",
    header: "Item Name",
    cell: ({ row }) => {
      return <span>{row.original.masterItem.name}</span>;
    },
  },
  {
    accessorKey: "masterItem.description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-gray-600">
          {row.original.masterItem.description}
        </span>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      return (
        <span>
          {Number(row.original.quantity).toFixed(2)} {row.original.uom.symbol}
        </span>
      );
    },
  },
  {
    accessorKey: "masterItem.category",
    header: "Category",
    cell: ({ row }) => {
      const categories = row.original.masterItem.category;
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
    accessorKey: "modifiedAt",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = new Date(row.original.modifiedAt);
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
];
