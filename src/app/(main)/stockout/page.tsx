"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import UpdateStockOut from "@/components/inventory/StockOut/UpdateStockOut";
import StockOutReceipt from "@/components/inventory/StockOut/StockOutReceipt";
import { Modal, ModalContent } from "@/components/ui/modal";
import { PaginatedDataTable } from "@/components/inventory/PaginatedStockOut/paginated-data-table";
import { usePaginatedStockOuts } from "@/lib/queries/inventoryQueries";
import {
  PaginationParams,
  StockOutReceipt as StockOutReceiptType,
} from "@/lib/types/inventory";
import { ColumnDef } from "@tanstack/react-table";

export default function StockOutPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] =
    useState<StockOutReceiptType | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const pageSize = 10;
  const params: PaginationParams & { month?: string; createdBy?: string } = {
    page: currentPage,
    limit: pageSize,
    search: searchQuery || undefined,
    month: selectedMonth || undefined,
    createdBy: selectedCreatedBy || undefined,
  };
  const {
    data: paginatedData,
    isLoading,
    error,
  } = usePaginatedStockOuts(params);

  // Define columns for the Stock Out receipts table
  const columns: ColumnDef<StockOutReceiptType>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => row.original.id,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
      cell: ({ row }) =>
        `${row.original.createdBy?.employee.firstName} ${row.original.createdBy?.employee.lastName}`,
    },
    {
      accessorKey: "modifiedAt",
      header: "Modified At",
      cell: ({ row }) => new Date(row.original.modifiedAt).toLocaleString(),
    },
    {
      accessorKey: "modifiedBy",
      header: "Modified By",
      cell: ({ row }) =>
        `${row.original.modifiedBy?.employee.firstName} ${row.original.modifiedBy?.employee.lastName}`,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewReceipt(row.original)}
        >
          View Receipt
        </Button>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleViewReceipt = (receipt: StockOutReceiptType) => {
    setSelectedReceipt(receipt);
    setShowReceiptModal(true);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-xl font-medium m-0">Stock Out</h1>
        <div className="flex gap-2">
          <UpdateStockOut />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Select value={selectedMonth ?? ""} onValueChange={(val) => { setSelectedMonth(val || null); setCurrentPage(1); }}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter by month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-10">October 2025</SelectItem>
              <SelectItem value="2025-09">September 2025</SelectItem>
              <SelectItem value="2025-08">August 2025</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCreatedBy ?? ""} onValueChange={(val) => { setSelectedCreatedBy(val || null); setCurrentPage(1); }}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Created by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user:john">John Doe</SelectItem>
              <SelectItem value="user:jane">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {paginatedData && (
        <PaginatedDataTable
          columns={columns}
          data={paginatedData.data}
          metadata={paginatedData.metadata}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}

      {error && (
        <div className="flex items-center justify-center h-32 text-red-600">
          <p>Error loading stock-out data: {error.message}</p>
        </div>
      )}

      {/* Receipt Modal */}
      <Modal
        isVisible={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
      >
        <ModalContent>
          {selectedReceipt && (
            <StockOutReceipt
              receiptData={{
                stockOut: selectedReceipt,
                items: selectedReceipt.items.map((item) => ({
                  itemId: item.itemId,
                  itemName: item.name,
                  quantity: item.quantity,
                  uomSymbol: item.uomSymbol,
                  isDamagedGoods: item.isDamagedGoods,
                  comment: item.comment || undefined,
                })),
              }}
              onClose={() => setShowReceiptModal(false)}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
