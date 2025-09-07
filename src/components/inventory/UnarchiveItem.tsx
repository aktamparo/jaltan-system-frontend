"use client"

import { IconRestore } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function UnarchiveItem() {
  return (
    <Button 
        variant="ghost"
        size="icon"
        className="size-8">
      <IconRestore/>
    </Button>
  );
}