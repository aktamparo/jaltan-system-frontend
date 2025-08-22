"use client";


import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { IconTruck } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";


const requestCardVariants = cva("", {
  variants: {
    variant: {
      Completed: "text-[#7ed378]",
      Pending: "text-[#ff6609]",
      Cancelled: "text-[#fc001b]",
    },
  },
  defaultVariants: {
    variant: "Completed",
  },
});


interface RequestCardProps extends VariantProps<typeof requestCardVariants> {
  title: string;
}


export default function RequestCard({
  title,
  variant = "Completed",
}: RequestCardProps) {
  const [completedCount, setCompletedCount] = useState<number>(3);
  const [pendingCount, setPendingCount] = useState<number>(5);
  const [cancelledCount, setCancelledCount] = useState<number>(6);


  let count: number;
  switch (variant) {
    case "Completed":
      count = completedCount;
      break;
    case "Pending":
      count = pendingCount;
      break;
    case "Cancelled":
      count = cancelledCount;
      break;
    default:
      count = 0;
  }


  return (
    <Card className="h-32 shadow-md rounded-2xl bg-[#f5e9e8] w-full mx-auto">
      <CardHeader className="h-full gap-4 flex flex-row items-center justify-center text-black text-lg font-medium">
        <div className="flex items-center gap-2">
          <IconTruck
            className="w-16 h-16 sm:w-20 sm:h-20"
          />
          <span
            className={cn(
              "font-semibold",
              requestCardVariants({ variant }),
              "text-3xl sm:text-5xl"
            )}
          >
            {count}
          </span>
        </div>
        <span className="hidden xl:inline-block text-base xl:text-lg">{title}</span>
      </CardHeader>
    </Card>
  );
}
