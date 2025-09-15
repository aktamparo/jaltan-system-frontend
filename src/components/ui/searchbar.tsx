"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconSearch } from "@tabler/icons-react";
import React, { useState, ChangeEvent } from "react";

export default function SearchBar() {
  const [value, setValue] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSearch = () => {
    console.log(value);
  };

  return (
    <div className="relative w-full max-w-sm">
      <Input
        type="search"
        name="search"
        placeholder="Enter search..."
        value={value}
        onChange={handleChange}
        className="pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleSearch}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <IconSearch/>
      </Button>
    </div>
  );
}
