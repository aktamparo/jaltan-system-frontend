"use client";

import React from "react";
import { InventoryItem, PaginationMetadata } from "@/lib/types/inventory";
import { PaginatedDataTable } from "./paginated-data-table";
import { ColumnDef } from "@tanstack/react-table";

interface SelectableInventoryTableProps {
  data: InventoryItem[];
  metadata: PaginationMetadata;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  error?: Error | null;
  isSelectionMode?: boolean;
  selectedItems?: InventoryItem[];
  onItemSelect?: (item: InventoryItem) => void;
}

export function SelectableInventoryTable({
  data,
  metadata,
  onPageChange,
  isLoading = false,
  error,
  isSelectionMode = false,
  selectedItems = [],
  onItemSelect,
}: SelectableInventoryTableProps) {
  const getColumns = (): ColumnDef<InventoryItem>[] => {
    const baseColumns: ColumnDef<InventoryItem>[] = [
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
              {Number(row.original.quantity).toFixed(2)}{" "}
              {row.original.uom?.symbol || '-'}
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

    if (isSelectionMode) {
      const selectColumn: ColumnDef<InventoryItem> = {
        id: "select",
        header: "Select",
        cell: ({ row }) => {
          const isSelected = selectedItems.some(
            (item) => item.id === row.original.id
          );
          return (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onItemSelect?.(row.original)}
              className="h-4 w-4"
            />
          );
        },
      };
      return [selectColumn, ...baseColumns];
    }

    return baseColumns;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-32 text-red-600">
        <p>Error loading inventory data: {error.message}</p>
      </div>
    );
  }

  return (
    <PaginatedDataTable
      columns={getColumns()}
      data={data}
      metadata={metadata}
      onPageChange={onPageChange}
      isLoading={isLoading}
    />
  );
}
