"use client";

import { UomType} from "@/lib/types/uom";
import { ColumnDef } from "@tanstack/react-table";
//import { ReferrerEnum } from "next/dist/lib/metadata/types/metadata-types"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<UomType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "uomType",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },

];
