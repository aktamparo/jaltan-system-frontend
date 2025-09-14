"use client";

import { useState } from "react";
import type { StockIn } from "@/components/inventory/StockIn/CreateStockIn/columns";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateStockInProps {
  items: StockIn[];
  onClose: () => void;
  onSave: (details: { itemId: string; quantity: number; uomName: string; uomId: string }[]) => void;
}

// Example UOM options for UI only
const UOM_OPTIONS = [
  { id: "UOM1", label: "kg" },
  { id: "UOM2", label: "g" },
  { id: "UOM3", label: "pcs" },
];

export default function CreateStockIn({
  items,
  onClose,
  onSave,
}: CreateStockInProps) {
  const [details, setDetails] = useState(
    items.map(item => ({
      itemId: item.id,
      quantity: 0,
      uomName: UOM_OPTIONS[0].label,
      uomId: UOM_OPTIONS[0].id,
    }))
  );

  const handleChange = (idx: number, field: string, value: string | number) => {
    setDetails(prev =>
      prev.map((d, i) =>
        i === idx ? { ...d, [field]: value } : d
      )
    );
  };

  const handleUomChange = (idx: number, uomId: string) => {
    const uom = UOM_OPTIONS.find(u => u.id === uomId);
    setDetails(prev =>
      prev.map((d, i) =>
        i === idx && uom ? { ...d, uomId, uomName: uom.label } : d
      )
    );
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
          {items.map((item, idx) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Input
                  id={`quantity-${item.id}`}
                  type="number"
                  value={details[idx].quantity}
                  onChange={e => handleChange(idx, "quantity", Number(e.target.value))}
                  className="w-24"
                  min={0}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={details[idx].uomId}
                  onValueChange={val => handleUomChange(idx, val)}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Select UOM" />
                  </SelectTrigger>
                  <SelectContent>
                    {UOM_OPTIONS.map(uom => (
                      <SelectItem key={uom.id} value={uom.id}>
                        {uom.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-start gap-2">
        <Button variant="outline" onClick={onClose}>
          Back
        </Button>
        <Button onClick={() => onSave(details)}>
          Save
        </Button>
      </div>
    </div>
  );
}