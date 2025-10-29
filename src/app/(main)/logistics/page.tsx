"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Searchbar from "@/components/ui/searchbar";
import { Button } from "@/components/ui/button";
import { SelectableInventoryTable } from "@/components/inventory/PaginatedInventory/selectable-inventory-table";
import { UnifiedItemRow } from "@/components/inventory/shared/UnifiedItemRow";
import { usePaginatedInventoryItems } from "@/lib/queries/inventoryQueries";
import { useMultipleUoMQueries } from "@/lib/hooks/useMultipleUoMQueries";
import { PaginationParams, InventoryItem } from "@/lib/types/inventory";
import { UoM } from "@/lib/types/uom";
import { 
  usePaginatedRequests, 
  useRequestById 
} from "@/lib/queries/requestQueries";
import { 
  useCreateRequest, 
  useUpdateRequest 
} from "@/lib/mutations/requestMutations";
import { 
  RequestPaginationParams, 
  CreateRequestDto,
  UpdateRequestDto 
} from "@/lib/types/request";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import RequestReceipt, { RequestReceiptData } from "@/components/logistics/RequestReceipt";
import { useQueryClient } from "@tanstack/react-query";
import { requestQueryKeys } from "@/lib/queries/requestQueries";
import { useGetAccount } from "@/lib/queries/accountQueries";
import AdminRequestTable from "@/components/logistics/AdminRequestTable";
import { useToast } from "@/components/ui/toast";

export default function LogisticsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [reviewingRequestId, setReviewingRequestId] = useState<string>("");
  const pageSize = 15;

  // Query client for manual cache invalidation
  const queryClient = useQueryClient();

  // Reload data when page mounts
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: requestQueryKeys.lists() });
  }, [queryClient]);

  // Get current user to determine role
  const { data: currentUser, isLoading: isLoadingUser } = useGetAccount();

  // Show loading state while fetching user data
  if (isLoadingUser) {
    return <div className="p-6">Loading...</div>;
  }

  if (!currentUser) {
    return <div className="p-6">Unable to load user information.</div>;
  }

  // Render different interfaces based on user role
  if (currentUser.role === "ADMIN") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Request Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Review and manage all requests
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Searchbar
              onSearchChange={setSearchQuery}
              placeholder="Search requests..."
            />
          </div>
        </div>

        <AdminRequestTable searchQuery={searchQuery} />
      </div>
    );
  }

  // Staff interface (existing logistics functionality)
  return (
    <StaffLogisticsInterface
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      isSelectionMode={isSelectionMode}
      setIsSelectionMode={setIsSelectionMode}
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
      showQuantityModal={showQuantityModal}
      setShowQuantityModal={setShowQuantityModal}
      showReviewModal={showReviewModal}
      setShowReviewModal={setShowReviewModal}
      showEditModal={showEditModal}
      setShowEditModal={setShowEditModal}
      reviewingRequestId={reviewingRequestId}
      setReviewingRequestId={setReviewingRequestId}
      pageSize={pageSize}
      queryClient={queryClient}
    />
  );
}

// Extract staff interface into a separate component
interface StaffLogisticsInterfaceProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  isSelectionMode: boolean;
  setIsSelectionMode: (mode: boolean) => void;
  selectedItems: InventoryItem[];
  setSelectedItems: (items: InventoryItem[] | ((prev: InventoryItem[]) => InventoryItem[])) => void;
  showQuantityModal: boolean;
  setShowQuantityModal: (show: boolean) => void;
  showReviewModal: boolean;
  setShowReviewModal: (show: boolean) => void;
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  reviewingRequestId: string;
  setReviewingRequestId: (id: string) => void;
  pageSize: number;
  queryClient: any;
}

function StaffLogisticsInterface({
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  isSelectionMode,
  setIsSelectionMode,
  selectedItems,
  setSelectedItems,
  showQuantityModal,
  setShowQuantityModal,
  showReviewModal,
  setShowReviewModal,
  showEditModal,
  setShowEditModal,
  reviewingRequestId,
  setReviewingRequestId,
  pageSize,
  queryClient,
}: StaffLogisticsInterfaceProps) {

  // Backend integration
  const createRequestMutation = useCreateRequest();
  const updateRequestMutation = useUpdateRequest();
  const toast = useToast();

  // Fetch specific request for review/edit
  const { data: requestToReview } = useRequestById(reviewingRequestId);

  // Pagination params for requests
  const requestPaginationParams: RequestPaginationParams = {
    page: currentPage,
    limit: pageSize,
    search: searchQuery || undefined,
  };

  // Fetch requests data
  const {
    data: requestsResponse,
    isLoading: isLoadingRequests,
    error: requestsError,
  } = usePaginatedRequests(requestPaginationParams);

  // Quantities for logistics request
  const [quantities, setQuantities] = useState<
    Record<string, { quantity: number; uomId: string }>
  >({});

  // Comment for request creation/edit
  const [requestComment, setRequestComment] = useState("");
  
  // Edit mode states
  const [editQuantities, setEditQuantities] = useState<
    Record<string, { quantity: number; uomId: string }>
  >({});
  const [editComment, setEditComment] = useState("");
  const [editSelectedItems, setEditSelectedItems] = useState<InventoryItem[]>([]);
  const [isEditSelectionMode, setIsEditSelectionMode] = useState(false);

  // Pagination params for inventory
  const paginationParams: PaginationParams = {
    page: currentPage,
    limit: pageSize,
    search: searchQuery || undefined,
  };

  const {
    data: response,
    isLoading,
    error,
  } = usePaginatedInventoryItems(paginationParams);

  // Get unique UoM type IDs from selected items
  const uniqueUomTypeIds = useMemo(() => {
    const typeIds: string[] = [];
    selectedItems.forEach((item) => {
      if (item?.masterItem?.uomTypeId) {
        typeIds.push(item.masterItem.uomTypeId);
      }
    });
    return [...new Set(typeIds)];
  }, [selectedItems]);

  // Get unique UoM type IDs from edit selected items
  const editUniqueUomTypeIds = useMemo(() => {
    const typeIds: string[] = [];
    editSelectedItems.forEach((item) => {
      // Skip items that are in edit mode (they have their UOM data already)
      if (item?.masterItem?.uomTypeId && item.masterItem.uomTypeId !== 'edit-mode') {
        typeIds.push(item.masterItem.uomTypeId);
      }
    });
    return [...new Set(typeIds)];
  }, [editSelectedItems]);

  // Combine both sets of UoM type IDs
  const allUniqueUomTypeIds = useMemo(() => {
    return [...new Set([...uniqueUomTypeIds, ...editUniqueUomTypeIds])];
  }, [uniqueUomTypeIds, editUniqueUomTypeIds]);

  // Optimized UoM fetching using the new hook
  const {
    uomsByType,
    isLoading: isLoadingUoms,
    error: uomsError,
  } = useMultipleUoMQueries(allUniqueUomTypeIds);

  // Function to get UoMs for a specific item
  const getUomsForItem = useCallback(
    (item: InventoryItem): UoM[] => {
      const uomTypeId = item?.masterItem?.uomTypeId;
      if (!uomTypeId || uomTypeId === 'edit-mode') {
        // For edit mode items, return the current UOM as the only option
        if (item?.uom) {
          return [{
            id: item.uom.id,
            name: item.uom.name,
            symbol: item.uom.symbol,
            isBase: true,
            conversionFactor: 1,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            uomTypeId: 'edit-mode',
          }];
        }
        return [];
      }
      return uomsByType[uomTypeId] || [];
    },
    [uomsByType]
  );

  // Filter and paginate data for logistics requests view
  const filteredData = useMemo(() => {
    if (isSelectionMode || isEditSelectionMode) return [];
    return requestsResponse?.data || [];
  }, [requestsResponse?.data, isSelectionMode, isEditSelectionMode]);

  const paginatedData = useMemo(() => {
    if (isSelectionMode || isEditSelectionMode) return [];
    return filteredData;
  }, [filteredData, isSelectionMode, isEditSelectionMode]);

  const totalPages = requestsResponse?.metadata?.totalPages || 1;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReview = (id: string) => {
    setReviewingRequestId(id);
    setShowReviewModal(true);
  };

  const handleCreate = () => {
    setIsSelectionMode(true);
    setSelectedItems([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleCancelOperation = () => {
    setIsSelectionMode(false);
    setSelectedItems([]);
    setQuantities({});
    setRequestComment("");
  };

  const handleItemSelect = (item: InventoryItem) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((selected) => selected.id === item.id);
      if (isSelected) {
        return prev.filter((selected) => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleNext = () => {
    const initialQuantities: Record<
      string,
      { quantity: number; uomId: string }
    > = {};
    selectedItems.forEach((item) => {
      initialQuantities[item.id] = {
        quantity: 0,
        uomId: item.uom?.id || '',
      };
    });
    setQuantities(initialQuantities);
    setShowQuantityModal(true);
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity },
    }));
  };

  const handleUomChange = (itemId: string, uomId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], uomId },
    }));
  };

  const handleSubmitLogisticsRequest = async () => {
    try {
      const validItems = selectedItems.filter(item => item?.id && quantities[item.id]?.quantity > 0);
      
      if (validItems.length === 0) {
        toast.error("Invalid Request", "Please select items with valid quantities.");
        return;
      }

      const requestData: CreateRequestDto = {
        items: validItems.map((item) => ({
          itemId: item.id,
          uomId: quantities[item.id].uomId,
          quantity: quantities[item.id].quantity,
        })),
        comment: requestComment.trim() || undefined,
      };

      await createRequestMutation.mutateAsync(requestData);
      
      // Reset state after successful submission
      setShowQuantityModal(false);
      setIsSelectionMode(false);
      setSelectedItems([]);
      setQuantities({});
      setRequestComment("");
      
      toast.success("Request Created", "Your logistics request has been submitted successfully.");
    } catch (error: any) {
      // Handle special success case
      if (error?.message === 'REQUEST_CREATED_SUCCESSFULLY') {
        // Treat as success
        setShowQuantityModal(false);
        setIsSelectionMode(false);
        setSelectedItems([]);
        setQuantities({});
        setRequestComment("");
        toast.success("Request Created", "Your logistics request has been submitted successfully.");
        return;
      }
      
      const errorMessage = error instanceof Error ? error.message : "Failed to create request";
      toast.error("Request Failed", errorMessage);
      console.error("Failed to create request:", error);
    }
  };

  const isValidSubmission = () => {
    return selectedItems.length > 0 && selectedItems.every((item) => item?.id && quantities[item.id]?.quantity > 0);
  };

  // Edit mode helper functions
  const handleEditQuantityChange = (itemId: string, quantity: number) => {
    setEditQuantities((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity },
    }));
  };

  const handleEditUomChange = (itemId: string, uomId: string) => {
    setEditQuantities((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], uomId },
    }));
  };

  const handleEditItemSelect = (item: InventoryItem) => {
    setEditSelectedItems((prev) => {
      const isSelected = prev.some((selected) => selected.id === item.id);
      if (isSelected) {
        // Remove item
        const newItems = prev.filter((selected) => selected.id !== item.id);
        // Also remove from quantities
        setEditQuantities((prevQuantities) => {
          const newQuantities = { ...prevQuantities };
          delete newQuantities[item.id];
          return newQuantities;
        });
        return newItems;
      } else {
        // Add item
        const newItems = [...prev, item];
        // Add default quantity
        setEditQuantities((prevQuantities) => ({
          ...prevQuantities,
          [item.id]: { quantity: 0, uomId: item.uom?.id || '' },
        }));
        return newItems;
      }
    });
  };

  const initializeEditMode = () => {
    if (!requestToReview || !requestToReview.items) return;
    
    // Set comment
    setEditComment(requestToReview.comment || "");
    
    // For edit mode, we don't need to create complex InventoryItem objects
    // We'll just track the item IDs and quantities for editing purposes
    const validRequestItems = requestToReview.items.filter(requestItem => {
      return (requestItem?.name || requestItem?.item?.masterItem) && 
             (requestItem?.uomSymbol || requestItem?.uom);
    });
    
    // Create a simplified structure for edit selected items that matches what we need
    const editItems = validRequestItems.map(requestItem => {
      const itemName = requestItem.name || requestItem.item?.masterItem?.name || '';
      const itemId = requestItem.itemId || requestItem.item?.id || '';
      const uomSymbol = requestItem.uomSymbol || requestItem.uom?.symbol || '';
      const uomId = requestItem.uomId || requestItem.uom?.id || '';
      
      return {
        id: itemId,
        quantity: requestItem.currentQuantity || requestItem.item?.quantity || 0,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        masterItemId: itemId,
        inventoryId: requestItem.inventoryId,
        masterItem: {
          id: itemId,
          name: itemName,
          description: '',
          uomTypeId: 'edit-mode', // Use a special identifier for edit mode
          category: [] as ("FRIDGE" | "PANTRY")[],
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
        },
        inventory: { id: requestItem.inventoryId },
        uom: {
          id: uomId,
          name: requestItem.uomName || requestItem.uom?.name || '',
          symbol: uomSymbol,
          isBase: true,
          conversionFactor: 1,
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
          uomTypeId: 'edit-mode',
        },
      };
    }) as unknown as InventoryItem[];
    
    setEditSelectedItems(editItems);
    
    // Set quantities
    const initialQuantities: Record<string, { quantity: number; uomId: string }> = {};
    validRequestItems.forEach(requestItem => {
      const itemId = requestItem.itemId || requestItem.item?.id || '';
      const uomId = requestItem.uomId || requestItem.uom?.id || '';
      if (itemId) {
        initialQuantities[itemId] = {
          quantity: requestItem.quantity,
          uomId: uomId,
        };
      }
    });
    setEditQuantities(initialQuantities);
  };

  const handleAddItems = () => {
    setIsEditSelectionMode(true);
    setShowEditModal(false); // Close the edit modal
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleCancelEditSelection = () => {
    setIsEditSelectionMode(false);
    setShowEditModal(true); // Reopen the edit modal
  };

  const handleConfirmEditSelection = () => {
    setIsEditSelectionMode(false);
    setShowEditModal(true); // Reopen the edit modal with updated items
    // Trigger data reload by invalidating the specific request query
    if (reviewingRequestId) {
      queryClient.invalidateQueries({ 
        queryKey: requestQueryKeys.detail(reviewingRequestId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: requestQueryKeys.lists() 
      });
    }
  };

  const handleSubmitEditRequest = async () => {
    try {
      const validItems = editSelectedItems.filter(item => item?.id && editQuantities[item.id]?.quantity > 0);
      
      if (validItems.length === 0) {
        toast.error("Invalid Request", "Please select items with valid quantities.");
        return;
      }

      const updateData: UpdateRequestDto = {
        items: validItems.map((item) => ({
          itemId: item.id,
          uomId: editQuantities[item.id].uomId,
          quantity: editQuantities[item.id].quantity,
        })),
        comment: editComment.trim() || undefined,
      };

      await updateRequestMutation.mutateAsync({
        id: reviewingRequestId,
        data: updateData,
      });
      
      // Reset state after successful submission
      setShowEditModal(false);
      setEditSelectedItems([]);
      setEditQuantities({});
      setEditComment("");
      
      // Refresh the request data
      queryClient.invalidateQueries({ 
        queryKey: requestQueryKeys.detail(reviewingRequestId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: requestQueryKeys.lists() 
      });
      
      toast.success("Request Updated", "Your logistics request has been updated successfully.");
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update request";
      toast.error("Update Failed", errorMessage);
      console.error("Failed to update request:", error);
    }
  };

  const isValidEditSubmission = () => {
    return editSelectedItems.length > 0 && editSelectedItems.every((item) => item?.id && editQuantities[item.id]?.quantity > 0);
  };

  // Helper function to get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'RESOLVED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-xl font-medium m-0">Logistics</h1>
        {!isSelectionMode && !isEditSelectionMode && (
          <div className="flex gap-2">
            <Button onClick={handleCreate}>Create</Button>
          </div>
        )}
      </div>

      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex flex-row items-center gap-2">
          <Searchbar
            onSearchChange={handleSearchChange}
            placeholder={
              isSelectionMode 
                ? "Search inventory items..." 
                : isEditSelectionMode 
                  ? "Search inventory items to add..." 
                  : "Search logistics items..."
            }
          />
        </div>
        {isSelectionMode && (
          <div className="flex gap-2">
            <span className="text-sm text-gray-600 mr-2">
              {selectedItems.length} item(s) selected for logistics request
            </span>
            <Button variant="outline" onClick={handleCancelOperation}>
              Cancel
            </Button>
            <Button onClick={handleNext} disabled={selectedItems.length === 0}>
              Next
            </Button>
          </div>
        )}
        {isEditSelectionMode && (
          <div className="flex gap-2">
            <span className="text-sm text-gray-600 mr-2">
              {editSelectedItems.length} item(s) selected for request
            </span>
            <Button variant="outline" onClick={handleCancelEditSelection}>
              Cancel
            </Button>
            <Button onClick={handleConfirmEditSelection}>
              Confirm Selection
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col w-full h-full gap-4">
        {isSelectionMode ? (
          <SelectableInventoryTable
            data={response?.data || []}
            metadata={
              response?.metadata || {
                total: 0,
                totalPages: 0,
                currentPage: 1,
                limit: pageSize,
              }
            }
            onPageChange={handlePageChange}
            isLoading={isLoading}
            error={error}
            isSelectionMode={isSelectionMode}
            selectedItems={selectedItems}
            onItemSelect={handleItemSelect}
          />
        ) : isEditSelectionMode ? (
          <SelectableInventoryTable
            data={response?.data || []}
            metadata={
              response?.metadata || {
                total: 0,
                totalPages: 0,
                currentPage: 1,
                limit: pageSize,
              }
            }
            onPageChange={handlePageChange}
            isLoading={isLoading}
            error={error}
            isSelectionMode={true}
            selectedItems={editSelectedItems}
            onItemSelect={handleEditItemSelect}
          />
        ) : (
          <>
            {isLoadingRequests ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-sm text-gray-500">Loading requests...</div>
              </div>
            ) : requestsError ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-sm text-red-500">
                  Error loading requests: {requestsError.message}
                </div>
              </div>
            ) : paginatedData.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-sm text-gray-500">No requests found</div>
              </div>
            ) : (
              <>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                          Reference Number
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                          Created At
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                          Created By
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedData.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {request.referenceNumber}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {request.createdBy.employee.firstName} {request.createdBy.employee.lastName}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(request.status)}`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReview(request.id)}
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                              Review
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {requestsResponse?.metadata ? (
                      <>
                        Showing {Math.min((requestsResponse.metadata.currentPage - 1) * requestsResponse.metadata.limit + 1, requestsResponse.metadata.total)} to{" "}
                        {Math.min(requestsResponse.metadata.currentPage * requestsResponse.metadata.limit, requestsResponse.metadata.total)} of{" "}
                        {requestsResponse.metadata.total} results
                      </>
                    ) : (
                      "No results"
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isLoadingRequests}
                    >
                      Previous
                    </Button>
                    <span className="px-3 py-1 text-sm">
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || isLoadingRequests}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Quantity Modal */}
      <Modal
        isVisible={showQuantityModal}
        onClose={() => setShowQuantityModal(false)}
      >
        <ModalHeader>
          <ModalTitle>Set Logistics Request Details</ModalTitle>
          <ModalDescription>
            Enter the quantity and unit of measurement for each item in the logistics request
          </ModalDescription>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-4">
            {selectedItems
              .filter(item => item?.id && item?.masterItem && item?.uom)
              .map((item) => (
              <UnifiedItemRow
                key={item.id}
                item={item}
                mode="stock-in"
                quantity={quantities[item.id]?.quantity || 0}
                selectedUomId={quantities[item.id]?.uomId || item.uom?.id}
                availableUoms={getUomsForItem(item)}
                isLoadingUoms={isLoadingUoms}
                uomsError={uomsError}
                onQuantityChange={(quantity) => handleQuantityChange(item.id, quantity)}
                onUomChange={(uomId) => handleUomChange(item.id, uomId)}
              />
            ))}
            
            {/* Comment Input */}
            <div className="mt-6 space-y-2">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                Comment (Optional)
              </label>
              <textarea
                id="comment"
                value={requestComment}
                onChange={(e) => setRequestComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
                placeholder="Add any additional comments for this request..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowQuantityModal(false)}
            >
              Back
            </Button>
            <Button
              onClick={handleSubmitLogisticsRequest}
              disabled={!isValidSubmission() || createRequestMutation.isPending}
            >
              {createRequestMutation.isPending ? "Creating..." : "Submit Logistics Request"}
            </Button>
          </div>
        </ModalContent>
      </Modal>

      {/* Review Modal */}
      <Modal
        isVisible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
      >
        <ModalHeader>
          <ModalTitle>Request Details</ModalTitle>
          <ModalDescription>
            Review the details of this logistics request
          </ModalDescription>
        </ModalHeader>
        <ModalContent>
          {requestToReview && requestToReview.items && (
            <div className="space-y-4">
              <RequestReceipt
                receiptData={{
                  request: requestToReview,
                  items: requestToReview.items
                    .filter(item => item?.name && item?.uomSymbol) // Filter based on actual API structure
                    .map((item) => ({
                      itemId: item.itemId,
                      itemName: item.name, // Use direct name property from API
                      quantity: item.quantity,
                      uomSymbol: item.uomSymbol, // Use direct uomSymbol from API
                    })),
                }}
                onClose={() => setShowReviewModal(false)}
              />
              
              {/* Edit Button */}
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => {
                    setShowReviewModal(false);
                    initializeEditMode();
                    setShowEditModal(true);
                  }}
                  disabled={requestToReview.status !== 'PENDING'}
                  className={requestToReview.status !== 'PENDING' ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {requestToReview.status !== 'PENDING' ? 'Cannot Edit (Not Pending)' : 'Edit Request'}
                </Button>
              </div>
            </div>
          )}
          {(!requestToReview || !requestToReview.items) && (
            <div className="flex justify-center items-center py-8">
              <div className="text-sm text-gray-500">Loading request details...</div>
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isVisible={showEditModal}
        onClose={() => setShowEditModal(false)}
      >
        <ModalHeader>
          <ModalTitle>Edit Request</ModalTitle>
          <ModalDescription>
            Modify the quantities, units, and items for this logistics request
          </ModalDescription>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-4">
            {editSelectedItems
              .filter(item => item?.id && item?.masterItem && item?.uom)
              .map((item) => (
              <UnifiedItemRow
                key={item.id}
                item={item}
                mode="stock-in"
                quantity={editQuantities[item.id]?.quantity || 0}
                selectedUomId={editQuantities[item.id]?.uomId || item.uom?.id}
                availableUoms={getUomsForItem(item)}
                isLoadingUoms={isLoadingUoms}
                uomsError={uomsError}
                onQuantityChange={(quantity) => handleEditQuantityChange(item.id, quantity)}
                onUomChange={(uomId) => handleEditUomChange(item.id, uomId)}
              />
            ))}
            
            {/* Add Items Button */}
            <div className="flex justify-center py-4">
              <Button
                variant="outline"
                onClick={handleAddItems}
              >
                Add Items
              </Button>
            </div>
            
            {/* Comment Input */}
            <div className="space-y-2">
              <label htmlFor="editComment" className="block text-sm font-medium text-gray-700">
                Comment (Optional)
              </label>
              <textarea
                id="editComment"
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
                placeholder="Add any additional comments for this request..."
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitEditRequest}
              disabled={!isValidEditSubmission() || updateRequestMutation.isPending}
            >
              {updateRequestMutation.isPending ? "Updating..." : "Update Request"}
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}