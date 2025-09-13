"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StockOutReceiptProps {
  receiptData: any;
  onClose: () => void;
}

export default function StockOutReceipt({ receiptData }: StockOutReceiptProps) {
  if (!receiptData) return null;

  return (
    <div className="flex flex-col items-center">
      <Card className="w-[400px] shadow-lg rounded-2xl border">
        <CardHeader className="text-center">
          <CardTitle className="mt-2 text-lg font-medium text-gray-600">
            Stock Out Receipt
          </CardTitle>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            ID: {receiptData.stockOut.id}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Created</span>
            <span>{new Date(receiptData.stockOut.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Created By</span>
            <span>{receiptData.stockOut.createdById}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Modified</span>
            <span>{new Date(receiptData.stockOut.modifiedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Modified By</span>
            <span>{receiptData.stockOut.modifiedById}</span>
          </div>

          <div className="pt-2 border-t">
            <span className="block font-semibold text-gray-700 mb-2">Items</span>
            <ul className="space-y-3">
              {receiptData.items.map((item: any) => (
                <li
                  key={item.itemId}
                  className="border rounded-lg p-3 bg-gray-50 shadow-sm"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Item ID</span>
                    <span>{item.itemId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Quantity</span>
                    <span>{item.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">UOM</span>
                    <span>{item.uomName}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


