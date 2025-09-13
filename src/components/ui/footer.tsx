"use client";
import StockInItem from "@/components/inventory/StockInItems/StockInItem";
import StockOutItem from "../inventory/StockOutItem";
import ViewArchive from "../inventory/ViewArchive";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full h-[80px] bg-white flex flex-row items-center justify-between px-6 rounded-t-xl">
      <div className="flex flex-col items-start">
       <ViewArchive/>
      </div>

      <div className="flex flex-row items-center gap-4">
        <StockInItem/>
        <StockOutItem/>
      </div>
    </footer>
  );
}