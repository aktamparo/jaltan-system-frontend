"use client";

import React from "react";
import { PaginatedDataTable } from "./paginated-data-table";
import { ColumnDef } from "@tanstack/react-table";

// Local type definition for UI development
type StockIn = {
  id: string;
  name: string;
  category: string[];
  quantity: number;
  createdAt: string;
  createdById: string;
  modifiedAt: string;
  modifiedById: string;
};

type PaginationMetadata = {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
};

interface SelectableStockInTableProps {
  data: StockIn[];
  metadata: PaginationMetadata;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  error?: Error | null;
  isSelectionMode?: boolean;
  selectedItem?: StockIn | null;
  onItemSelect?: (item: StockIn) => void;
}

export function SelectableStockInTable({
  data,
  metadata,
  onPageChange,
  isLoading = false,
  error,
  isSelectionMode = false,
  selectedItem = null,
  onItemSelect,
}: SelectableStockInTableProps) {
  const getColumns = (): ColumnDef<StockIn>[] => {
    const baseColumns: ColumnDef<StockIn>[] = [
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
              {row.original.quantity}
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

    if (isSelectionMode) {
      const selectColumn: ColumnDef<StockIn> = {
        id: "select",
        header: "Select",
        cell: ({ row }) => {
          const isSelected = selectedItem?.id === row.original.id;
          return (
            <input
              type="radio"
              name="stock-in-selection"
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
        <p>Error loading stock-in data: {error.message}</p>
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