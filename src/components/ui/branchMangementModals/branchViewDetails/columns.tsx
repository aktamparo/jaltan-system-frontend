"use client";

import { ColumnDef } from "@tanstack/react-table";
//import { ReferrerEnum } from "next/dist/lib/metadata/types/metadata-types"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Branch = {
  id: string;
  name: string;
  street: string;
  city: string;
  province: string;
  zipCode: string;
};

export const columns: ColumnDef<Branch>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Branch Name",
  },
  {
    accessorKey: "street",
    header: "Street",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "province",
    header: "Province",
  },
  {
    accessorKey: "zipCode",
    header: "Zip Code",
  },
];
