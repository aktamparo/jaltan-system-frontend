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
import { Button } from "@/components/ui/button";
import AddItem from "@/components/inventory/AddItem";
import EditItem from "@/components/inventory/EditItem";
import ArchiveItem from "@/components/inventory/ArchiveItem";
import Searchbar from "@/components/ui/searchbar";
import ViewArchive from "@/components/inventory/ViewArchive";
import UnarchiveItem from "@/components/inventory/UnarchiveItem";
import StockInItem from "@/components/inventory/StockInItem";
import StockOutItem from "@/components/inventory/StockOutItem";

export default function InventoryPage() {

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-xl font-medium m-0">Inventory</h1>
      </div>

      <div className="flex flex-row items-center justify-between mb-4">
        
        <div className="flex flex-row items-center gap-2">
          <Searchbar/>
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

        <AddItem />
      </div>

      {/* Container for table do not mind archive, edit, and restore/unarchive button */}
      <div className="w-full h-full gap-4 p-4 rounded-lg shadow border bg-white max-h-[400px] overflow-y-auto">
          <ArchiveItem/>
          <EditItem/>
          <UnarchiveItem/>
        </div>

        <div className="flex flex-row items-center mt-2 gap-2">
            <ViewArchive/>

            <div className="flex flex-row items-center gap-2 mt-2 ml-auto">
                <StockInItem/>
                <StockOutItem/>
            </div>
            </div>
    </>
  );
}
