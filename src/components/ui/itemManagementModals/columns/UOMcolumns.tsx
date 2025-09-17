"use client";

import { ColumnDef } from "@tanstack/react-table";
//import { ReferrerEnum } from "next/dist/lib/metadata/types/metadata-types"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import {UoM}  from "@//lib/types/uom";

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

