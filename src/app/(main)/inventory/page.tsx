"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Searchbar from "@/components/ui/searchbar";
import StockInItem from "@/components/inventory/StockIn/StockInItem";
import UpdateStockIn from "@/components/inventory/StockIn/UpdateStockIn";
//import StockOutItem from "@/components/inventory/StockOutItems/StockOutItem";
import { DataTable as ViewTable } from "@/components/inventory/ViewBranchItems/user-view-table";
import { InventoryItem, columns as ViewColumns } from "@/components/inventory/ViewBranchItems/columns";

export default function InventoryPage() {
  const data: InventoryItem[] = [];

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-xl font-medium m-0">Inventory</h1>
      </div>

      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex flex-row items-center gap-2">
          <Searchbar />
          <Select>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Branches</SelectLabel>
                <SelectItem value="Claveria">Claveria</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col w-full h-full gap-4 max-h-[400px] overflow-y-auto">
        <ViewTable columns={ViewColumns} data={data}/>
        <div className="flex flex-row items-center gap-2 mt-2 ml-auto">
          <StockInItem />
          <UpdateStockIn/>
          {/* <StockOutItem /> */}
        </div>
      </div>

    </>
  );
}

