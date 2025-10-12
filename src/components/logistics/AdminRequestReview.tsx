"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/modal";
import { useRequestById } from "@/lib/queries/requestQueries";
import { useUpdateRequest } from "@/lib/mutations/requestMutations";
import { useQueryClient } from "@tanstack/react-query";
import { requestQueryKeys } from "@/lib/queries/requestQueries";
import { RequestStatus } from "@/lib/types/request";

interface AdminRequestReviewProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
}

export default function AdminRequestReview({
  isOpen,
  onClose,
  requestId,
}: AdminRequestReviewProps) {
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | "">("");
  const [originalStatus, setOriginalStatus] = useState<RequestStatus | "">("");
  
  const queryClient = useQueryClient();
  const { data: request, isLoading } = useRequestById(requestId);
  const updateRequestMutation = useUpdateRequest();

  // Set initial status when request data loads
  useEffect(() => {
    if (request?.status) {
      setSelectedStatus(request.status);
      setOriginalStatus(request.status);
    }
  }, [request?.status]);

  const handleSave = () => {
    if (!request || selectedStatus === originalStatus || !selectedStatus) {
      onClose();
      return;
    }

    updateRequestMutation.mutate(
      {
        id: requestId,
        data: {
          status: selectedStatus as RequestStatus,
        },
      },
      {
        onSuccess: () => {
          // Invalidate and refetch requests
          queryClient.invalidateQueries({ 
            queryKey: requestQueryKeys.lists() 
          });
          queryClient.invalidateQueries({ 
            queryKey: requestQueryKeys.detail(requestId) 
          });
          onClose();
        },
        onError: (error) => {
          console.error("Failed to update request:", error);
        },
      }
    );
  };

  const handleCancel = () => {
    setSelectedStatus(originalStatus);
    onClose();
  };

  const isStatusLocked = selectedStatus === RequestStatus.CANCELLED || selectedStatus === RequestStatus.RESOLVED;
  const statusOptions = [RequestStatus.PENDING, RequestStatus.APPROVED, RequestStatus.RESOLVED, RequestStatus.CANCELLED];

  if (isLoading) {
    return (
      <Modal isVisible={isOpen} onClose={onClose}>
        <ModalContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <ModalHeader>
            <ModalTitle>Loading Request...</ModalTitle>
          </ModalHeader>
          <div className="p-6">Loading request details...</div>
        </ModalContent>
      </Modal>
    );
  }

  if (!request) {
    return (
      <Modal isVisible={isOpen} onClose={onClose}>
        <ModalContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <ModalHeader>
            <ModalTitle>Request Not Found</ModalTitle>
          </ModalHeader>
          <div className="p-6">Unable to load request details.</div>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isVisible={isOpen} onClose={onClose}>
      <ModalContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <ModalHeader>
          <ModalTitle>Review Request #{request.id}</ModalTitle>
          <ModalDescription>
            Created by: {request.createdBy?.employee?.firstName} {request.createdBy?.employee?.lastName}
          </ModalDescription>
        </ModalHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Items & Quantities</h3>
            
            {request.items && request.items.length > 0 ? (
              <div className="space-y-3">
                {request.items.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.name || "Unknown Item"}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity: {item.quantity} {item.uomSymbol || "units"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No items found for this request.</p>
            )}

            {request.comment && (
              <div className="space-y-2">
                <h4 className="font-medium">Comments</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {request.comment}
                </p>
              </div>
            )}

            {request.remark && (
              <div className="space-y-2">
                <h4 className="font-medium">Remarks</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {request.remark}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="border-t p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <label htmlFor="status-select" className="font-medium">
              Status:
            </label>
            <select
              id="status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as RequestStatus)}
              disabled={isStatusLocked}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={updateRequestMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateRequestMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateRequestMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}