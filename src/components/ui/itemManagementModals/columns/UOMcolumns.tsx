"use client";


import { ColumnDef } from "@tanstack/react-table";
import { UoM } from "@/lib/types/uom";

export const columns: ColumnDef<UoM>[] = [
  {
    accessorKey: "name",
    header: "Master Item Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "conversionFactor",
    header: "Conversion Factor",
  },
];

