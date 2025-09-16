"use client";

import Searchbar from "@/components/ui/searchbar";
import { DataTable as ViewTable } from "@/components/inventory/StockOut/ViewStockOut/user-view-table";
import { columns as ViewColumns, StockOut } from "@/components/inventory/StockOut/ViewStockOut/columns";

export default function StockOutPage() {
  const data: StockOut[] = []; // replace with fetched stock out data

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-xl font-medium m-0">Stock Out</h1>
      </div>

      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex flex-row items-center gap-2">
          <Searchbar />
        </div>
      </div>

      <div className="flex flex-col w-full h-full gap-4 max-h-[400px] overflow-y-auto">
        <ViewTable columns={ViewColumns} data={data} />
      </div>
    </>
  );
}

