"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IconFileInvoice,
  IconCalendarTime,
  IconUser,
  IconBox,
} from "@tabler/icons-react";

interface Employee {
  firstName: string;
  lastName: string;
}

interface CreatedBy {
  employee: Employee;
}

interface ModifiedBy {
  employee: Employee;
}

interface StockOut {
  id: string;
  referenceNumber: string;
  createdAt: string;
  modifiedAt: string;
  createdBy: CreatedBy;
  modifiedBy: ModifiedBy;
}

interface ReceiptItem {
  itemId: string;
  itemName: string;
  quantity: number;
  uomSymbol: string;
  isDamagedGoods?: boolean;
  comment?: string;
}

export interface ReceiptData {
  stockOut: StockOut;
  items: ReceiptItem[];
}

interface StockOutReceiptProps {
  receiptData: ReceiptData;
  onClose: () => void;
  onEdit?: () => void;
}

export default function StockOutReceipt({ receiptData, onEdit }: StockOutReceiptProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="w-[420px] shadow-xl rounded-2xl border">
        <CardHeader className="text-center">
          <IconFileInvoice className="mx-auto h-10 w-10 text-gray-700" />
          <CardTitle className="mt-2 text-lg font-medium text-gray-600">
            Stock Out Receipt
          </CardTitle>
          <p className="text-2xl font-bold text-gray-800 mt-1 tracking-wide">
            #{receiptData.stockOut.referenceNumber}
          </p>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          {/* Created At */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <IconCalendarTime size={18} />
              <span>Created</span>
            </div>
            <span className="font-medium">
              {new Date(receiptData.stockOut.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Created By */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <IconUser size={18} />
              <span>Created By</span>
            </div>
            <span className="font-medium">
              {receiptData.stockOut.createdBy.employee.firstName}{" "}
              {receiptData.stockOut.createdBy.employee.lastName}
            </span>
          </div>

          {/* Modified At */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <IconCalendarTime size={18} />
              <span>Modified</span>
            </div>
            <span className="font-medium">
              {new Date(receiptData.stockOut.modifiedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Modified By */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <IconUser size={18} />
              <span>Modified By</span>
            </div>
            <span className="font-medium">
              {receiptData.stockOut.modifiedBy.employee.firstName}{" "}
              {receiptData.stockOut.modifiedBy.employee.lastName}
            </span>
          </div>

          {/* Items */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <IconBox size={18} />
              Items ({receiptData.items.length})
            </h3>
            <div className="space-y-2">
              {receiptData.items.map((item) => (
                <div
                  key={item.itemId}
                  className="py-2 px-3 bg-gray-50 rounded-lg space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">
                      {item.itemName}
                    </span>
                    <span className="text-gray-600">
                      {Number(item.quantity).toFixed(2)} {item.uomSymbol}
                    </span>
                  </div>

                  {/* Damaged Goods */}
                  {item.isDamagedGoods && (
                    <div className="text-red-600 text-xs font-medium">
                      Damaged
                    </div>
                  )}

                  {/* Comment */}
                  {item.comment && (
                    <div className="text-gray-600 text-xs">
                      {item.comment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Edit Button */}
      {onEdit && (
        <Button 
          onClick={onEdit}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md"
        >
          Edit Stock Out
        </Button>
      )}
    </div>
  );
}
