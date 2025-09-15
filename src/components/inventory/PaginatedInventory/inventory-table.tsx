"use client";

import React from "react";
import { PaginatedDataTable } from "./paginated-data-table";
import { columns } from "./columns";
import { InventoryItem, PaginationMetadata } from "@/lib/types/inventory";

interface InventoryTableProps {
  data: InventoryItem[];
  metadata: PaginationMetadata;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function InventoryTable({
  data,
  metadata,
  onPageChange,
  isLoading = false,
  error,
}: InventoryTableProps) {
  if (error) {
    return (
      <div className="flex items-center justify-center h-32 text-red-600">
        <p>Error loading inventory data: {error.message}</p>
      </div>
    );
  }

  return (
    <PaginatedDataTable
      columns={columns}
      data={data}
      metadata={metadata}
      onPageChange={onPageChange}
      isLoading={isLoading}
    />
  );
}
