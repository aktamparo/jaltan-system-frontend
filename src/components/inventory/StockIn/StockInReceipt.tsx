"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface StockIn {
  id: string;
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
}

export interface ReceiptData {
  stockIn: StockIn;
  items: ReceiptItem[];
}

interface StockInReceiptProps {
  receiptData: ReceiptData;
  onClose: () => void;
}

export default function StockInReceipt({ receiptData }: StockInReceiptProps) {
  return (
    <div className="flex flex-col items-center">
      <Card className="w-[420px] shadow-xl rounded-2xl border">
        <CardHeader className="text-center">
          <IconFileInvoice className="mx-auto h-10 w-10 text-gray-700" />
          <CardTitle className="mt-2 text-lg font-medium text-gray-600">
            Stock In Receipt
          </CardTitle>
          <p className="text-2xl font-bold text-gray-800 mt-1 tracking-wide">
            #{receiptData.stockIn.id}
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
              {new Date(receiptData.stockIn.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Created By */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <IconUser size={18} />
              <span>Created By</span>
            </div>
            <span className="font-medium">
              {receiptData.stockIn.createdBy.employee.firstName}{" "}
              {receiptData.stockIn.createdBy.employee.lastName}
            </span>
          </div>

          {/* Modified At */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <IconCalendarTime size={18} />
              <span>Modified</span>
            </div>
            <span className="font-medium">
              {new Date(receiptData.stockIn.modifiedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Modified By */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <IconUser size={18} />
              <span>Modified By</span>
            </div>
            <span className="font-medium">
              {receiptData.stockIn.modifiedBy.employee.firstName}{" "}
              {receiptData.stockIn.modifiedBy.employee.lastName}
            </span>
          </div>

          {/* Items Section */}
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 mb-2 text-gray-700 font-semibold">
              <span>Items</span>
            </div>
            <div className="divide-y">
              {receiptData.items.map((item) => (
                <div
                  key={item.itemId}
                  className="flex justify-between items-center py-2"
                >
                  <span>{item.itemName}</span>
                  <span className="font-medium">
                    {Number(item.quantity).toFixed(2)} {item.uomSymbol}
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
