"use client";

import { useState, useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePickerInput from "@/components/ui/date-picker";
import { useToast } from "@/components/ui/toast";
import { useGetSalesList } from "@/lib/queries/salesQueries";
import { useDeleteSalesByCSV } from "@/lib/mutations/salesMutations";
import { SalesRecord } from "@/lib/types/sales";
import { DataTable } from "@/components/ui/userViewComponents/user-view-table";
import PaginationControls from "@/components/ui/PaginationControls";
import { format, parseISO } from "date-fns";

export default function SalesDataTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [csvFileToDelete, setCsvFileToDelete] = useState("");
  const [availableCsvFiles, setAvailableCsvFiles] = useState<string[]>([]);
  
  const toast = useToast();
  const deleteMutation = useDeleteSalesByCSV();

  const { data: response, isLoading, error } = useGetSalesList({
    page,
    limit: 15,
    search: search || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const salesData = useMemo(() => response?.data ?? [], [response?.data]);

  // Extract unique CSV filenames from sales data
  useEffect(() => {
    if (salesData.length > 0) {
      const uniqueFiles = Array.from(
        new Set(
          salesData
            .map(record => record.csvFileName)
            .filter((fileName): fileName is string => fileName !== undefined && fileName.trim() !== "")
        )
      ).sort();
      setAvailableCsvFiles(uniqueFiles);
    }
  }, [salesData]);

  const handleDeleteCSV = () => {
    if (!csvFileToDelete) {
      toast.error("Error", "Please select a CSV file to delete");
      return;
    }

    if (confirm(`Are you sure you want to delete all sales records from "${csvFileToDelete}"?`)) {
      deleteMutation.mutate(csvFileToDelete, {
        onSuccess: (response) => {
          toast.success("Delete Successful", 
            `Successfully deleted ${response.deletedCount} sales records from ${csvFileToDelete}`
          );
          setCsvFileToDelete("");
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
      cell: ({ getValue }) => {
        const fileName = getValue() as string;
        if (!fileName) return <span className="text-gray-400">Manual</span>;
        
        return (
          <span className="text-xs font-mono truncate" title={fileName}>
            {fileName}
          </span>
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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading sales data: {error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Sales Records</h3>
        <div className="text-sm text-gray-500">
          Total: {response?.metadata?.total ?? 0} records
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
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
      {availableCsvFiles.length > 0 && (
        <div className="border rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delete Records by CSV File
              </label>
              <select
                value={csvFileToDelete}
                onChange={(e) => setCsvFileToDelete(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D22929]"
              >
                <option value="">Select a CSV file...</option>
                {availableCsvFiles.map((fileName) => (
                  <option key={fileName} value={fileName}>
                    {fileName}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={handleDeleteCSV}
              disabled={!csvFileToDelete || deleteMutation.isPending}
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
          {response && response.metadata.totalPages > 1 && (
            <div className="mt-6">
              <PaginationControls
                currentPage={page}
                totalPages={response.metadata.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}

          {salesData.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-500">No sales records found.</p>
              {search && (
                <Button onClick={clearFilters} className="mt-4">
                  Clear filters to see all records
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}