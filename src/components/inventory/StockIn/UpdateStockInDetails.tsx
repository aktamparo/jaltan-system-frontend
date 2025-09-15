"use client";

import { useState } from "react";
import type { StockIn } from "@/components/inventory/StockIn/UpdateStockInDetails/columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UpdateStockInProps {
  item: StockIn | null;
  onClose: () => void;
  onSave: (details: {
    itemId: string;
    quantity: number;
    uomName: string;
    uomId: string;
  }[]) => void;
}

const UOM_OPTIONS = [
  { id: "UOM1", label: "kg" },
  { id: "UOM2", label: "g" },
  { id: "UOM3", label: "pcs" },
];

export default function UpdateStockInDetails({
  item,
  onClose,
  onSave,
}: UpdateStockInProps) {
  if (!item) return null;

  const [detail, setDetail] = useState({
    itemId: item.id,
    quantity: 0,
    uomName: UOM_OPTIONS[0].label,
    uomId: UOM_OPTIONS[0].id,
  });

  const handleChange = (field: string, value: string | number) => {
    setDetail((prev) => ({ ...prev, [field]: value }));
  };

  const handleUomChange = (uomId: string) => {
    const uom = UOM_OPTIONS.find((u) => u.id === uomId);
    if (uom) {
      setDetail((prev) => ({ ...prev, uomId, uomName: uom.label }));
    }
  };

  const handleSave = () => {
    onSave([detail]);
  };

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit of Measurement</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>
              <Input
                id={`quantity-${item.id}`}
                type="number"
                value={detail.quantity}
                onChange={(e) =>
                  handleChange("quantity", Number(e.target.value))
                }
                className="w-24"
                min={0}
              />
            </TableCell>
            <TableCell>
              <Select
                value={detail.uomId}
                onValueChange={(val) => handleUomChange(val)}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Select UOM" />
                </SelectTrigger>
                <SelectContent>
                  {UOM_OPTIONS.map((uom) => (
                    <SelectItem key={uom.id} value={uom.id}>
                      {uom.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="flex justify-start gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Back
        </Button>
        <Button type="button" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}


