"use client";

import Searchbar from "@/components/ui/searchbar";
import { DataTable as ViewTable } from "@/components/inventory/StockIn/ViewStockIn/user-view-table";
import { columns as ViewColumns, StockIn } from "@/components/inventory/StockIn/ViewStockIn/columns";

export default function StockInPage() {
  const data: StockIn[] = [];

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-xl font-medium m-0">Stock In</h1>
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
