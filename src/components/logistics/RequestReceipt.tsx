"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconFileInvoice,
  IconCalendarTime,
  IconUser,
  IconBox,
} from "@tabler/icons-react";
import { Request } from "@/lib/types/request";

export interface RequestReceiptData {
  request: Request;
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
    uomSymbol: string;
  }[];
}

interface RequestReceiptProps {
  receiptData: RequestReceiptData;
  onClose: () => void;
}

export default function RequestReceipt({ receiptData }: RequestReceiptProps) {
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
    <div className="flex flex-col items-center">
      <Card className="w-[420px] shadow-xl rounded-2xl border">
        <CardHeader className="text-center">
          <IconFileInvoice className="mx-auto h-10 w-10 text-gray-700" />
          <CardTitle className="mt-2 text-lg font-medium text-gray-600">
            Logistics Request
          </CardTitle>
          <p className="text-2xl font-bold text-gray-800 mt-1 tracking-wide">
            {receiptData.request.referenceNumber}
          </p>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          {/* Status */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <IconBox size={18} />
              <span>Status</span>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(receiptData.request.status)}`}>
              {receiptData.request.status}
            </span>
          </div>

          {/* Created At */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <IconCalendarTime size={18} />
              <span>Created</span>
            </div>
            <span className="font-medium">
              {new Date(receiptData.request.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Created By */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <IconUser size={18} />
              <span>Created By</span>
            </div>
            <span className="font-medium">
              {receiptData.request.createdBy.employee.firstName}{" "}
              {receiptData.request.createdBy.employee.lastName}
            </span>
          </div>

          {/* Modified At */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <IconCalendarTime size={18} />
              <span>Modified</span>
            </div>
            <span className="font-medium">
              {new Date(receiptData.request.modifiedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Modified By */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <IconUser size={18} />
              <span>Modified By</span>
            </div>
            <span className="font-medium">
              {receiptData.request.modifiedBy.employee.firstName}{" "}
              {receiptData.request.modifiedBy.employee.lastName}
            </span>
          </div>

          {/* Comment */}
          {receiptData.request.comment && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-600">
                <IconFileInvoice size={18} />
                <span>Comment</span>
              </div>
              <span className="font-medium pl-6">
                {receiptData.request.comment}
              </span>
            </div>
          )}

          {/* Remark */}
          {receiptData.request.remark && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-600">
                <IconFileInvoice size={18} />
                <span>Remark</span>
              </div>
              <span className="font-medium pl-6">
                {receiptData.request.remark}
              </span>
            </div>
          )}

          {/* Items */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <IconBox size={18} />
              Items ({receiptData.items.length})
            </h3>
            <div className="space-y-2">
              {receiptData.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-700">
                    {item.itemName}
                  </span>
                  <span className="text-gray-600">
                    {item.quantity} {item.uomSymbol}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}