"use client";
import { useState } from "react";
import { queryClient } from "@/lib/react-query";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable as ViewTable } from "@/components/ui/userViewComponents/user-view-table";
import PaginationControls from "@/components/ui/PaginationControls";
import { useGetAllMasterItems } from "@/lib/queries/inventoryQueries";
import { useQueries } from "@tanstack/react-query";
import { getUOMTypeById } from "@/lib/services/uomServices";
import { MasterItem } from "@/lib/types/inventory";
export default function ViewMasterItems() {
  const [showViewTable, setShowViewTable] = useState(false);
  const [page, setPage] = useState(1);

  const { data: response } = useGetAllMasterItems(page);
  const masterItems = response?.data ?? [];
  console.log("masterItems", response);
  // Get all unique uomTypeIds from master items
  const uomTypeIds: string[] = Array.from(new Set(masterItems.map((item: { uomTypeId?: string }) => item.uomTypeId).filter((id: string | undefined): id is string => !!id)));
  
  // Use useQueries to fetch each UOM type by its ID
  // Import getUOMTypeById at the top if not already
  // import { getUOMTypeById } from "@/lib/services/uomServices";
  const uomTypeQueries = useQueries({
    queries: uomTypeIds.map((id: string) => ({
      queryKey: ["uomType", id],
      queryFn: () => getUOMTypeById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: true,
    }))
  });
  useEffect(() => {
    if (showViewTable) {
      queryClient.invalidateQueries({ queryKey: ["masterItems"] });
    }
  }, [showViewTable]);
  // Build a mapping from uomTypeId to UOM type name
  const uomTypeIdToName: Record<string, string> = {};
  uomTypeQueries.forEach((q, idx) => {
    if (q.data && typeof q.data.type === "string" && uomTypeIds[idx]) {
      uomTypeIdToName[uomTypeIds[idx]] = q.data.type;
    }
  });

  // Custom columns definition to show master item details and UOM type name
  const columns: ColumnDef<MasterItem>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ getValue }) => Array.isArray(getValue() as string[]) ? (getValue() as string[]).join(", ") : getValue(),
    },
    {
      accessorKey: "uomTypeId",
      header: "UOM Type",
      cell: ({ row }) => uomTypeIdToName[row.original.uomTypeId] || row.original.uomTypeId,
    },
  
  ];
  return (
    <div>
      <Button
        onClick={() => setShowViewTable(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">View All Master Items</span>
        <span className="text-s text-gray-500">
          See all registered master items and their details
        </span>
      </Button>
      {showViewTable && (
        <Modal isVisible={showViewTable} onClose={() => setShowViewTable(false)}>
          <ModalHeader>
            <ModalTitle>Master Items</ModalTitle>
            <ModalDescription>View all master items and their details</ModalDescription>
          </ModalHeader>
          
          <ModalContent>
            <ViewTable columns={columns} data={masterItems} />
          </ModalContent>
          
          <ModalFooter>
            <div className="flex w-full items-center justify-center">
              <PaginationControls
                currentPage={page}
                totalPages={response?.metadata?.totalPages ?? 1}
                onPageChange={setPage}
              />
            </div>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}