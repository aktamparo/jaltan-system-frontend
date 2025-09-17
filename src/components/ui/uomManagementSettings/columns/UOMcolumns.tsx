"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UoM } from "@/lib/types/uom";

// Function to create columns with uomTypeIdToName mapping
export const createUOMColumns = (uomTypeIdToName: Record<string, string>): ColumnDef<UoM>[] => [
  {
    accessorKey: "name",
    header: "UOM Name",
  },
  {
    accessorKey: "uomTypeId",
    header: "UOM Type Name",
    cell: ({ row }) => {
      const uomTypeId = row.original.uomTypeId;
      return uomTypeIdToName[uomTypeId] || uomTypeId;
    },
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
  },
  {
    accessorKey: "isBase",
    header: "Is Base?",
    cell: ({ row }) => row.original.isBase ? "Yes" : "No",
  },
  {
    accessorKey: "conversionFactor",
    header: "Conversion Factor",
  },
];

// Default columns without UOM Type name resolution (fallback)
export const columns: ColumnDef<UoM>[] = [
  {
    accessorKey: "name",
    header: "UOM Name",
  },
  {
    accessorKey: "uomTypeId",
    header: "UOM Type ID",
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
  },
  {
    accessorKey: "isBase",
    header: "Is Base?",
    cell: ({ row }) => row.original.isBase ? "Yes" : "No",
  },
  {
    accessorKey: "conversionFactor",
    header: "Conversion Factor",
  },
];

