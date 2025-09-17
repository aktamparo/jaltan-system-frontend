"use client";

import { UoM } from "@/lib/types/uom";
import { ColumnDef } from "@tanstack/react-table";

export function getColumns(
  selectedId: string | null,
  setSelectedId: (id: string) => void
): ColumnDef<UoM>[] {
  return [
    {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <input
          type="radio"
          name="user-radio"
          checked={selectedId === row.original.id}
          onChange={() => setSelectedId(row.original.id)}
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "symbol",
      header: "Symbol",
    },
    {
      accessorKey: "isBase",
      header: "Is Base",
    },
    {
      accessorKey: "conversionFactor",
      header: "Conversion Factor",
    },
    {
      accessorKey: "uomTypeId",
      header: "UOM Type",
    },
  ];
}