import { ColumnDef } from "@tanstack/react-table";
import type { Branch } from "@/components/ui/branchMangementModals/branchViewDetails/columns";

export function getColumns(
  selectedId: string | null,
  setSelectedId: (id: string) => void
): ColumnDef<Branch>[] 
{
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
}
