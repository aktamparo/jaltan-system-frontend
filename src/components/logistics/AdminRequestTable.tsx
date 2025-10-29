"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePaginatedRequests } from "@/lib/queries/requestQueries";
import { RequestPaginationParams } from "@/lib/types/request";
import AdminRequestReview from "./AdminRequestReview";

// Simple Badge component inline to avoid import issues
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

interface AdminRequestTableProps {
  searchQuery: string;
}

export default function AdminRequestTable({ searchQuery }: AdminRequestTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingRequestId, setReviewingRequestId] = useState<string>("");
  const pageSize = 15;

  const requestParams: RequestPaginationParams = {
    page: currentPage,
    limit: pageSize,
    search: searchQuery || undefined,
  };

  const { data: requestsData, isLoading } = usePaginatedRequests(requestParams);

  const handleReview = (requestId: string) => {
    setReviewingRequestId(requestId);
    setShowReviewModal(true);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "APPROVED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "RESOLVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading requests...</div>;
  }

  if (!requestsData?.data || requestsData.data.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No requests found.</p>
      </div>
    );
  }

  const totalPages = requestsData.metadata?.totalPages || 1;

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                Reference Number
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                Created By
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {requestsData.data.map((request) => (
              <tr key={request.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {request.referenceNumber}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {request.createdBy?.employee?.firstName}{" "}
                  {request.createdBy?.employee?.lastName}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    className={getStatusBadgeColor(request.status)}
                  >
                    {request.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Button
                    onClick={() => handleReview(request.id)}
                    size="sm"
                    variant="outline"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <AdminRequestReview
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setReviewingRequestId("");
        }}
        requestId={reviewingRequestId}
      />
    </div>
  );
}