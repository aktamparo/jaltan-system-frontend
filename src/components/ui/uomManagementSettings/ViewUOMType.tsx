"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "@/components/ui/modal";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable as ViewTable } from "@/components/ui/userViewComponents/user-view-table";
import PaginationControls from "@/components/ui/PaginationControls";
import { useGetAllUOMTypes } from "@/lib/queries/uomQueries";
import { getUOMById } from "@/lib/services/uomServices";
import { useQueries } from "@tanstack/react-query";
export default function ViewUOMType() {
  const [showViewTable, setShowViewTable] = useState(false);
  const [page, setPage] = useState(1);

  const { data: AllUOM } = useGetAllUOMTypes(page);
  // Get all unique standardUoMId values from UOM types
  const standardUoMIds = Array.from(new Set((AllUOM?.data ?? []).map(uomType => uomType.standardUoMId).filter(Boolean)));

  // Use useQueries to fetch each UOM by its ID
  const uomQueries = useQueries({
    queries: standardUoMIds.map(id => ({
      queryKey: ["uom", id],
      queryFn: () => getUOMById(id as string),
      enabled: typeof id === "string" && !!id,
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: true,
    }))
  });

  // Build a mapping from standardUoMId to UOM name
  const uomIdToName: Record<string, string> = {};
  uomQueries.forEach((q, idx) => {
    if (q.data && standardUoMIds[idx]) {
      uomIdToName[standardUoMIds[idx]] = q.data.name;
    }
  });

  // Custom columns definition to show type and resolve standardUoMId to UOM name
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "standardUoMId",
      header: "Standard UOM",
      cell: ({ getValue }) => uomIdToName[getValue() as string] || getValue(),
    },
  ];
  return (
    <div>
      <Button
        onClick={() => setShowViewTable(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">View All UOM</span>
        <span className="text-s text-gray-500">
          See all registered UOM and their details
        </span>
      </Button>

      <Modal isVisible={showViewTable} onClose={() => setShowViewTable(false)}>
        <ModalHeader>
          <ModalTitle>View All UOM Types</ModalTitle>
          <ModalDescription>
            All registered UOM Types in the system
          </ModalDescription>
        </ModalHeader>

        <ModalContent>
          <div className="w-full">
            <ViewTable columns={columns} data={AllUOM?.data || []} />
          </div>
        </ModalContent>

        <ModalFooter>
          <PaginationControls
            currentPage={page}
            totalPages={AllUOM?.metadata?.totalPages || 1}
            onPageChange={setPage}
          />
        </ModalFooter>
      </Modal>
    </div>
  );
}
