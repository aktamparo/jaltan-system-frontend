"use client";

import { useState, useEffect } from "react";
import Searchbar from "@/components/ui/searchbar";
import { Button } from "@/components/ui/button";
import StockOutReceipt from "@/components/inventory/StockOut/StockOutReceipt";
import EditStockOut from "@/components/inventory/StockOut/EditStockOut";
import { Modal, ModalContent } from "@/components/ui/modal";
import { PaginatedDataTable } from "@/components/inventory/PaginatedStockOut/paginated-data-table";
import { usePaginatedStockOuts } from "@/lib/queries/inventoryQueries";
import {
  PaginationParams,
  StockOutReceipt as StockOutReceiptType,
} from "@/lib/types/inventory";
import { ColumnDef } from "@tanstack/react-table";
import ScrollableComponent from "@/components/ui/scrollableComponent";
import { useQueryClient } from "@tanstack/react-query";

export default function StockOutPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReceipt, setSelectedReceipt] =
    useState<StockOutReceiptType | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const queryClient = useQueryClient();

  // Reload data when page mounts
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["stockouts"] });
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
  } = usePaginatedStockOuts(params);

  // Define columns for the Stock Out receipts table
  const columns: ColumnDef<StockOutReceiptType>[] = [
    {
      accessorKey: "id",
      header: "Reference Number",
      cell: ({ row }) => row.original.referenceNumber,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ' at ' + new Date(row.original.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
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
      cell: ({ row }) => new Date(row.original.modifiedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ' at ' + new Date(row.original.modifiedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
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
    setIsEditMode(false);
    setShowReceiptModal(true);
  };

  const handleEditMode = () => {
    setIsEditMode(true);
  };

  const handleEditSuccess = () => {
    setIsEditMode(false);
    setShowReceiptModal(false);
    queryClient.invalidateQueries({ queryKey: ["stockouts"] });
  };

  const handleCloseModal = () => {
    setShowReceiptModal(false);
    setIsEditMode(false);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <ScrollableComponent>
        <div className="flex flex-row items-center justify-between mb-4">
          <h1 className="text-xl font-medium m-0">Stock Out</h1>
        </div>
      <div className="flex flex-row items-center justify-between mb-4">
        <Searchbar
          onSearchChange={handleSearchChange}
          placeholder="Search stock-out receipts"
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
          <p>Error loading stock-out data: {error.message}</p>
        </div>
      )}

      {/* Receipt Modal */}
      <Modal
        isVisible={showReceiptModal}
        onClose={handleCloseModal}
      >
        <ModalContent>
          {selectedReceipt && !isEditMode && (
            <StockOutReceipt
              receiptData={{
                stockOut: selectedReceipt,
                items: selectedReceipt.items.map((item) => ({
                  itemId: item.id,
                  itemName: item.name,
                  quantity: item.quantity,
                  uomSymbol: item.uomSymbol,
                  isDamagedGoods: item.isDamagedGoods,
                  comment: item.comment || undefined,
                })),
              }}
              onClose={handleCloseModal}
              onEdit={handleEditMode}
            />
          )}
          {selectedReceipt && isEditMode && (
            <EditStockOut
              receiptData={{
                stockOut: {
                  id: selectedReceipt.id,
                  createdAt: selectedReceipt.createdAt,
                  createdById: selectedReceipt.createdBy?.id || "",
                  modifiedAt: selectedReceipt.modifiedAt,
                  modifiedById: selectedReceipt.modifiedBy?.id || "",
                },
                items: selectedReceipt.items,
              }}
              onClose={handleCloseModal}
              onSuccess={handleEditSuccess}
            />
          )}
        </ModalContent>
      </Modal>
      </ScrollableComponent>
    </div>
  );
}
