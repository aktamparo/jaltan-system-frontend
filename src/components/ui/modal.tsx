"use client";

import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children?: ReactNode;
  className?: string;
}

export default function Modal({ isVisible, onClose, children, className }: ModalProps) {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-full max-w-4xl h-[35vh] overflow-y-auto",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <IconX size={20} />
        </Button>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function ModalTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function ModalDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function ModalAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function ModalContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Modal,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalAction,
  ModalDescription,
  ModalContent,
};