"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  
  const toast = useToast();
  const deleteMutation = useDeleteSalesByCSV();

  const { data: response, isLoading, error } = useGetSalesList({
    page,
    limit: 15,
    search: search || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const salesData = response?.data ?? [];

  const handleDeleteCSV = (csvFileName: string) => {
    if (!csvFileName) {
      toast.error("Error", "No CSV filename specified");
      return;
    }

    if (confirm(`Are you sure you want to delete all sales records from "${csvFileName}"?`)) {
      deleteMutation.mutate(csvFileName, {
        onSuccess: (response) => {
          toast.success("Delete Successful", 
            `Successfully deleted ${response.deletedCount} sales records from ${csvFileName}`
          );
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
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono truncate max-w-24" title={fileName}>
              {fileName}
            </span>
            <Button
              onClick={() => handleDeleteCSV(fileName)}
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={deleteMutation.isPending}
            >
              Delete CSV
            </Button>
          </div>
        );
      },
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleDateFilterChange = () => {
    setPage(1); // Reset to first page when filtering
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search items, transactions..."
          value={search}
          onChange={handleSearchChange}
          className="w-full"
        />
        <Input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            handleDateFilterChange();
          }}
          className="w-full"
        />
        <Input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            handleDateFilterChange();
          }}
          className="w-full"
        />
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Clear Filters
        </Button>
      </div>

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
              {(search || startDate || endDate) && (
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