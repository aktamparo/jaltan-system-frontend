"use client";

import React from "react";
import { PaginatedDataTable } from "../PaginatedStockOut/paginated-data-table";
import { stockOutColumns, StockOut } from "./columns";
import { Button } from "@/components/ui/button";

// Local types for UI development
type PaginationMetadata = {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
};

interface StockOutTableProps {
  data: StockOut[];
  metadata: PaginationMetadata;
  onPageChange: (page: number) => void;
  onViewReceipt: (item: StockOut) => void; // NEW: Add callback for viewing receipt
  isLoading?: boolean;
  error?: Error | null;
}

export function StockOutTable({
  data,
  metadata,
  onPageChange,
  onViewReceipt, // NEW
  isLoading = false,
  error,
}: StockOutTableProps) {
  if (error) {
    return (
      <div className="flex items-center justify-center h-32 text-red-600">
        <p>Error loading stock-out data: {error.message}</p>
      </div>
    );
  }

  const columnsWithActions = [
    ...stockOutColumns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: StockOut } }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewReceipt(row.original)}
        >
          View Receipt
        </Button>
      ),
    },
  ];

  return (
    <PaginatedDataTable
      columns={columnsWithActions}
      data={data}
      metadata={metadata}
      onPageChange={onPageChange}
      isLoading={isLoading}
    />
  );
}
