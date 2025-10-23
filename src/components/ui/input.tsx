"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const [showPass, setShowPass] = React.useState(false);
    const isPassword = type === "password";

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={isPassword && !showPass ? "password" : "text"}
          data-slot="input"
          className={cn(
            "[&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-clear-button]:hidden [&::-webkit-reveal-button]:hidden",
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
          {...props}
        />
        {isPassword && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2"
          >
            {showPass ? <IconEyeOff size={18} /> : <IconEye size={18} />}
          </Button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };

