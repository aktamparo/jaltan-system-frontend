"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";

export default function AddItem() {
  const [showAddItem, setShowAddItem] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: [] as string[],
    uomTypeId: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFormData((prev) => ({
      ...prev,
      category: selected,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Created:", data);
      setShowAddItem(false);
      setFormData({ name: "", description: "", category: [], uomTypeId: "" });
    } catch (err) {
      console.error("Error creating item:", err);
    }
  };

  return (
    <>
      <Button onClick={() => setShowAddItem(true)}>Add Item</Button>
      <Modal className="w-full max-w-sm" isVisible={showAddItem} onClose={() => setShowAddItem(false)}>
        <ModalHeader>
          <ModalTitle>Add Item</ModalTitle>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalContent className="mb-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uomTypeId">UoM Type</Label>
                <Input
                  id="uomTypeId"
                  name="uomTypeId"
                  value={formData.uomTypeId}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                    id="category"
                    name="category"
                    className="w-full border rounded px-2 py-1"
                    value={formData.category[0] || ""}
                    onChange={handleCategoryChange}
                >
                  <option value="FRIDGE">FRIDGE</option>
                  <option value="PANTRY">PANTRY</option>
                  <option value="FRIDGE, PANTRY">FRIDGE, PANTRY</option>
                </select>
              </div>


            </div>
          </ModalContent>

          <ModalFooter className="space-y-2">
            <Button type="submit">Save</Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
