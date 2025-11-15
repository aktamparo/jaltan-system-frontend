"use client";

import { useState, useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePickerInput from "@/components/ui/date-picker";
import { useToast } from "@/components/ui/toast";
import { useGetSalesList, useGetUploads } from "@/lib/queries/salesQueries";
import { useDeleteSalesByUploadId } from "@/lib/mutations/salesMutations";
import { SalesRecord } from "@/lib/types/sales";
import { DataTable } from "@/components/ui/userViewComponents/user-view-table";
import PaginationControls from "@/components/ui/PaginationControls";
import { format, parseISO } from "date-fns";

export default function SalesDataTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [uploadIdToDelete, setUploadIdToDelete] = useState("");
  
  const toast = useToast();
  const deleteMutation = useDeleteSalesByUploadId();

  const { data: response, isLoading, error } = useGetSalesList({
    page,
    limit: 15,
    search: search || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  // Fetch ALL uploaded CSV files (not limited to current sales page)
  const { data: uploadsResponse } = useGetUploads({
    limit: 1000, // Get all uploads
  });

  const salesData = useMemo(() => response?.data ?? [], [response?.data]);
  const availableUploads = useMemo(() => uploadsResponse?.data ?? [], [uploadsResponse?.data]);

  // Debug logging
  useEffect(() => {
    console.log("Current page:", page);
    console.log("Response metadata:", response?.metadata);
  }, [page, response]);

  const handleDeleteCSV = () => {
    if (!uploadIdToDelete) {
      toast.error("Error", "Please select a CSV file to delete");
      return;
    }

    const selectedUpload = availableUploads.find(upload => upload.id === uploadIdToDelete);
    const fileName = selectedUpload?.fileName || "this file";

    if (confirm(`Are you sure you want to delete all sales records from "${fileName}"?`)) {
      deleteMutation.mutate(uploadIdToDelete, {
        onSuccess: (response) => {
          toast.success("Delete Successful", 
            `Successfully deleted ${response.deletedCount} sales records from ${response.fileName}`
          );
          setUploadIdToDelete("");
        },
        onError: (error) => {
          const errorMessage = error instanceof Error ? error.message : "Delete failed";
          toast.error("Delete Failed", errorMessage);
        },
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const columns: ColumnDef<SalesRecord>[] = [
    {
      accessorKey: "transactionDate",
      header: "Date",
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return format(parseISO(date), "MMM dd, yyyy");
      },
    },
    {
      accessorKey: "transactionId",
      header: "Transaction ID",
      cell: ({ getValue }) => {
        const id = getValue() as string;
        return (
          <span className="font-mono text-xs">
            {id.length > 12 ? `${id.slice(0, 12)}...` : id}
          </span>
        );
      },
    },
    {
      accessorKey: "itemName",
      header: "Item",
      cell: ({ getValue }) => {
        const name = getValue() as string;
        return (
          <div className="max-w-32 truncate" title={name}>
            {name}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "quantity",
      header: "Qty",
      cell: ({ getValue }) => (
        <span className="text-right">
          {new Intl.NumberFormat("en-US").format(getValue() as number)}
        </span>
      ),
    },
    {
      accessorKey: "unitPrice",
      header: "Unit Price",
      cell: ({ getValue }) => formatCurrency(getValue() as number),
    },
    {
      accessorKey: "totalAmount",
      header: "Total",
      cell: ({ getValue }) => (
        <span className="font-semibold">
          {formatCurrency(getValue() as number)}
        </span>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment",
      cell: ({ getValue }) => (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "customerType",
      header: "Customer",
    },
    {
      accessorKey: "csvFileName",
      header: "Source File",
      cell: ({ row }) => {
        const upload = row.original.salesUpload;
        if (!upload) return <span className="text-gray-400">Manual</span>;
        
        return (
          <div className="flex flex-col">
            <span className="text-xs font-mono truncate" title={upload.fileName}>
              {upload.fileName}
            </span>
            <span className="text-xs text-gray-500">
              by {upload.uploadedBy.employee.firstName} {upload.uploadedBy.employee.lastName}
            </span>
          </div>
        );
      },
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading sales data: {error.message}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">;
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h3 className="text-lg font-semibold">Sales Records</h3>
        <div className="text-sm text-gray-500">
          Total: {response?.metadata?.total ?? 0} records
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 flex-shrink-0">
        <Input
          type="text"
          placeholder="Search items, transactions..."
          value={search}
          onChange={handleSearchChange}
          className="w-64 h-10"
        />
        
        <div className="w-64">
          <DatePickerInput
            value={startDate}
            onChange={(iso) => { 
              setStartDate(iso); 
              setPage(1);
            }}
            placeholder="MMM/dd/yyyy"
          />
        </div>
        
        <span className="text-gray-500">to</span>
        
        <div className="w-64">
          <DatePickerInput
            value={endDate}
            onChange={(iso) => { 
              setEndDate(iso); 
              setPage(1);
            }}
            placeholder="MMM/dd/yyyy"
          />
        </div>

        <Button onClick={clearFilters} variant="outline" className="h-10 px-6 whitespace-nowrap">
          Clear Filters
        </Button>
      </div>

      {/* Delete CSV Section */}
      {availableUploads.length > 0 && (
        <div className="border rounded-lg p-4 mb-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delete Records by CSV File
              </label>
              <select
                value={uploadIdToDelete}
                onChange={(e) => setUploadIdToDelete(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D22929]"
              >
                <option value="">Select a CSV file...</option>
                {availableUploads.map((upload) => (
                  <option key={upload.id} value={upload.id}>
                    {upload.fileName} ({upload._count?.sales ?? 0} records) - {format(parseISO(upload.uploadedAt), "MMM dd, yyyy")}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={handleDeleteCSV}
              disabled={!uploadIdToDelete || deleteMutation.isPending}
              className="mt-6 bg-[#D22929] hover:bg-[#D22929] text-white disabled:opacity-50 disabled:bg-[#D22929]"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete CSV Records"}
            </Button>
          </div>
          <p className="text-xs text-[#D22929] mt-2">
            Warning: This will permanently delete all sales records imported from the selected CSV file.
          </p>
        </div>
      )}

      {/* Data Table */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sales data...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <DataTable columns={columns} data={salesData} />
            </div>

            {/* Pagination */}
            {response && response.metadata && response.metadata.totalPages > 1 && (
              <div className="mt-6">
                <PaginationControls
                  currentPage={page}
                  totalPages={response.metadata.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}

            {salesData.length === 0 && !isLoading && (
              <div className="border border-gray-200 rounded-lg p-8 text-center mt-6">
                <p className="text-gray-900 text-lg font-medium mb-2">No data found</p>
                <p className="text-sm text-gray-600 mb-4">
                  {search || startDate || endDate 
                    ? "No sales records match your current filters." 
                    : "No sales data available."}
                </p>
                {(search || startDate || endDate) && (
                  <Button onClick={clearFilters} variant="outline">
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}