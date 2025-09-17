"use client";
import { useState, useEffect } from "react";
import { queryClient } from "@/lib/react-query";
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
import { useGetAllMasterItems } from "@/lib/queries/inventoryQueries";
import { useQueries } from "@tanstack/react-query";
import { getUOMTypeById } from "@/lib/services/uomServices";
import EditItemModal from "@/components/ui/itemManagementModals/EditItemModal";
import { MasterItem, EditMasterItem } from "@/lib/types/inventory";
export default function EditMasterItems() {
  const [showEditTable, setShowEditTable] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const { data: response } = useGetAllMasterItems(page);
  const masterItems = response?.data ?? [];
  // Get all unique uomTypeIds from master items
  const uomTypeIds: string[] = Array.from(new Set(masterItems.map((item: { uomTypeId?: string }) => item.uomTypeId).filter((id: string | undefined): id is string => !!id)));

  // Use useQueries to fetch each UOM type by its ID
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
    if (showEditTable) {
      queryClient.invalidateQueries({ queryKey: ["masterItems"] });
    }
  }, [showEditTable]);

  // Build a mapping from uomTypeId to UOM type name
  const uomTypeIdToName: Record<string, string> = {};
  uomTypeQueries.forEach((q, idx) => {
    if (q.data && typeof q.data.type === "string" && uomTypeIds[idx]) {
      uomTypeIdToName[uomTypeIds[idx]] = q.data.type;
    }
  });

  // Custom columns definition to show master item details and UOM type name, plus radio select
  const columns: ColumnDef<MasterItem>[] = [
    {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <input
          type="radio"
          name="selectedItem"
          checked={selectedItemId === row.original.id}
          onChange={() => setSelectedItemId(row.original.id)}
        />
      ),
    },
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
        onClick={() => setShowEditTable(true)}
        className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      >
        <span className="text-s text-black">Edit Master Items</span>
        <span className="text-s text-gray-500">
          Select and edit master items and their details
        </span>
      </Button>
      {showEditTable && (
        <Modal isVisible={showEditTable} onClose={() => setShowEditTable(false)}>
          <div className="p-6">
            <h2 className="text-lg font-bold mb-2">Edit Master Items</h2>
            <p className="mb-4 text-gray-600">Select a master item to edit</p>
            <ViewTable columns={columns} data={masterItems} />
            <div className="mt-4">
              <PaginationControls
                currentPage={page}
                totalPages={response?.totalPages ?? 1}
                onPageChange={setPage}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => setShowEditItemModal(true)}
                disabled={!selectedItemId}
              >
                Edit Selected Item
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {showEditItemModal && selectedItemId && (
        <Modal
          isVisible={showEditItemModal}
          onClose={() => setShowEditItemModal(false)}
        >
          <ModalHeader>
            <ModalTitle>Edit Item Details</ModalTitle>
          </ModalHeader>
          <ModalContent>
            <EditItemModal
              item={masterItems.find((item: MasterItem) => item.id === selectedItemId) as EditMasterItem}
              onClose={() => setShowEditItemModal(false)}
            />
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
