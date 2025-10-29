"use client";

import { useState, useEffect } from "react";
import Searchbar from "@/components/ui/searchbar";
import { Button } from "@/components/ui/button";
import StockInReceipt from "@/components/inventory/StockIn/StockInReceipt";
import { Modal, ModalContent } from "@/components/ui/modal";
import { PaginatedDataTable } from "@/components/inventory/PaginatedStockIn/paginated-data-table";
import { usePaginatedStockIns } from "@/lib/queries/inventoryQueries";
import {
  PaginationParams,
  StockInReceipt as StockInReceiptType,
} from "@/lib/types/inventory";
import { ColumnDef } from "@tanstack/react-table";
import ScrollableComponent from "@/components/ui/scrollableComponent";
import { useQueryClient } from "@tanstack/react-query";

export default function StockInPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReceipt, setSelectedReceipt] =
    useState<StockInReceiptType | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const queryClient = useQueryClient();

  // Reload data when page mounts
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["stockins"] });
  }, [queryClient]);

  const pageSize = 10;
  const params: PaginationParams = {
    page: currentPage,
    limit: pageSize,
    search: searchQuery || undefined,
  };
  const {
    data: paginatedData,
    isLoading,
    error,
  } = usePaginatedStockIns(params);

  // Define columns for the Stock In receipts table
  const columns: ColumnDef<StockInReceiptType>[] = [
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

  const handleViewReceipt = (receipt: StockInReceiptType) => {
    setSelectedReceipt(receipt);
    setShowReceiptModal(true);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <ScrollableComponent>
        <div className="flex flex-row items-center justify-between mb-4">
          <h1 className="text-xl font-medium m-0">Stock In</h1>
        </div>
      <div className="flex flex-row items-center justify-between mb-4">
        <Searchbar
          onSearchChange={handleSearchChange}
          placeholder="Search stock-in receipts"
        />
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
          <p>Error loading stock-in data: {error.message}</p>
        </div>
      )}
      {/* Receipt Modal */}
      <Modal
        isVisible={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
      >
        <ModalContent>
          {selectedReceipt && (
            <StockInReceipt
              receiptData={{
                stockIn: {
                  ...selectedReceipt,
                  referenceNumber: (selectedReceipt as StockInReceiptType & { referenceNumber?: string }).referenceNumber ?? "",
                },
                items: selectedReceipt.items.map((item) => ({
                  itemId: item.itemId,
                  itemName: item.name,
                  quantity: item.quantity,
                  uomSymbol: item.uomSymbol,
                })),
              }}
              onClose={() => setShowReceiptModal(false)}
            />
          )}
        </ModalContent>
      </Modal>
      </ScrollableComponent>
    </div>
  );
}
