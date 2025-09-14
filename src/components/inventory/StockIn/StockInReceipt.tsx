"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <Card className="w-[400px] shadow-lg rounded-2xl border">
        <CardHeader className="text-center">
          <CardTitle className="mt-2 text-lg font-medium text-gray-600">
            Stock In Receipt
          </CardTitle>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            ID: {receiptData.stockIn.id}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Created</span>
            <span>
              {new Date(receiptData.stockIn.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Created By</span>
            <span>
              {receiptData.stockIn.createdBy.employee.firstName}{" "}
              {receiptData.stockIn.createdBy.employee.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Modified</span>
            <span>
              {new Date(receiptData.stockIn.modifiedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Modified By</span>
            <span>
              {receiptData.stockIn.modifiedBy.employee.firstName}{" "}
              {receiptData.stockIn.modifiedBy.employee.lastName}
            </span>
          </div>

          <div className="pt-2 border-t">
            <span className="block font-semibold text-gray-700 mb-2">Items</span>
            <div className="divide-y">
              {receiptData.items.map((item) => (
                <div
                  key={item.itemId}
                  className="flex justify-between items-center py-2"
                >
                  <span>{item.itemName}</span>
                  <span>
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
