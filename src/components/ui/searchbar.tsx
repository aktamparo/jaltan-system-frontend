"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconSearch } from "@tabler/icons-react";
import React, { useState, ChangeEvent } from "react";

interface SearchBarProps {
  onSearchChange?: (value: string) => void;
  placeholder?: string;
  defaultValue?: string;
  debounceMs?: number;
}

export default function SearchBar({
  onSearchChange,
  placeholder = "Enter search...",
  defaultValue = "",
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSearch = () => {
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      <Input
        type="search"
        name="search"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        className="pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleSearch}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <IconSearch />
      </Button>
    </div>
  );
}
