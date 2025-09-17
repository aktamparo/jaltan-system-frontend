"use client";

import { ColumnDef } from "@tanstack/react-table";
//import { ReferrerEnum } from "next/dist/lib/metadata/types/metadata-types"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import {UoM,UomType}  from "@//lib/types/uom";
import { useGetUOMTypeById } from "@/lib/queries/uomQueries";

export const columns: ColumnDef<UoM>[] = [
  {
    accessorKey: "name",
    header: "UOM Name",
  },
  {
    accessorKey: "uomTypeId",
    header: "UOM Type Name",
    cell: ({ getValue }) => {
      const uomTypeId = getValue() as string;
      const {data} = useGetUOMTypeById(uomTypeId);
      const uomType = data as UomType | undefined;
      return uomType?.type || uomTypeId;
    },
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
  },
  {
    accessorKey: "isBase",
    header: "Is Base?",
  },
  {
    accessorKey: "conversionFactor",
    header: "Conversion Factor",
  },
  
];

