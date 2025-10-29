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
import { createUOMColumns } from "@/components/ui/uomManagementSettings/columns/UOMcolumns";
import { DataTable as ViewTable } from "@/components/ui/userViewComponents/user-view-table";
import PaginationControls from "@/components/ui/PaginationControls";
import { useGetAllUOM } from "@/lib/queries/uomQueries";
import { useQueries } from "@tanstack/react-query";
import { getUOMTypeById } from "@/lib/services/uomServices";
export default function ViewUOM() {
  const [showViewTable, setShowViewTable] = useState(false);
  const [page, setPage] = useState(1);
  const { data: AllUOMs } = useGetAllUOM(page);
  
  // Get all unique uomTypeIds from UOMs
  const uomTypeIds: string[] = Array.from(
    new Set(
      (AllUOMs?.data ?? [])
        .map((uom) => uom.uomTypeId)
        .filter(Boolean)
    )
  );

  // Use useQueries to fetch each UOM Type by its ID
  const uomTypeQueries = useQueries({
    queries: uomTypeIds.map((id) => ({
      queryKey: ["uomType", id],
      queryFn: () => getUOMTypeById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: true,
    })),
  });

  // Build a mapping from uomTypeId to UOM type name
  const uomTypeIdToName: Record<string, string> = {};
  uomTypeQueries.forEach((q, idx) => {
    if (q.data && uomTypeIds[idx]) {
      uomTypeIdToName[uomTypeIds[idx]] = q.data.type;
    }
  });

  // Create columns with the uomType name mapping
  const columns = createUOMColumns(uomTypeIdToName);

  return (
    <div>
      <Button
        onClick={() => setShowViewTable(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">View All Unit of Meassurements</span>
        <span className="text-s text-gray-500">
          See all registered Unit of Measurements and their details
        </span>
      </Button>

      <Modal isVisible={showViewTable} onClose={() => setShowViewTable(false)}>
        <ModalHeader>
          <ModalTitle>View All Users</ModalTitle>
          <ModalDescription>
            All registered users in the system
          </ModalDescription>
        </ModalHeader>

        <ModalContent>
          <div className="w-full">
            <ViewTable columns={columns} data={AllUOMs?.data || []} />
          </div>
        </ModalContent>

        <ModalFooter>
          <div className="flex w-full items-center justify-center">
            <PaginationControls
              currentPage={page}
              totalPages={AllUOMs?.metadata?.totalPages || 1}
              onPageChange={setPage}
            />
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
}
