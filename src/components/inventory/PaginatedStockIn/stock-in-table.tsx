"use client";

import React from "react";
import { PaginatedDataTable } from "../PaginatedStockIn/paginated-data-table";
import { stockInColumns, StockIn } from "./columns";
import { Button } from "@/components/ui/button";

// Local types for UI development
type PaginationMetadata = {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
};

interface StockInTableProps {
  data: StockIn[];
  metadata: PaginationMetadata;
  onPageChange: (page: number) => void;
  onViewReceipt: (item: StockIn) => void; // NEW: Add callback for viewing receipt
  isLoading?: boolean;
  error?: Error | null;
}

export function StockInTable({
  data,
  metadata,
  onPageChange,
  onViewReceipt, // NEW
  isLoading = false,
  error,
}: StockInTableProps) {
  if (error) {
    return (
      <div className="flex items-center justify-center h-32 text-red-600">
        <p>Error loading stock-in data: {error.message}</p>
      </div>
    );
  }

  const columnsWithActions = [
    ...stockInColumns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: StockIn } }) => (
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
