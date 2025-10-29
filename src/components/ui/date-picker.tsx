"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Calendar } from "./calendar"
import { Input } from "./input"
import { Calendar as CalendarIcon } from "lucide-react"
import { format, parseISO, isValid, parse } from "date-fns"

type Props = {
  value?: string
  onChange?: (isoDate: string) => void
  placeholder?: string
}

export default function DatePickerInput({ value, onChange, placeholder }: Props) {
  const [open, setOpen] = React.useState(false)
  const DISPLAY_FORMAT = "MMM/dd/yyyy"
  const [inputValue, setInputValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const popoverRef = React.useRef<HTMLDivElement | null>(null)
  const blurTimeout = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (!value) {
      setInputValue("")
      return
    }
    try {
      const parsed = parseISO(value)
      if (isValid(parsed)) {
        setInputValue(format(parsed, DISPLAY_FORMAT))
      } else {
        setInputValue(value)
      }
    } catch {
      setInputValue(value)
    }
  }, [value])

  const handleSelect = (date: Date | undefined) => {
    if (!date) return
    const iso = format(date, "yyyy-MM-dd")
    const display = format(date, DISPLAY_FORMAT)
    setInputValue(display)
    onChange?.(iso)
    // return focus to input so user can continue typing if they want
    requestAnimationFrame(() => inputRef.current?.focus())
    setOpen(false)
  }

  const applyTypedValue = () => {
    const trimmed = inputValue.trim()
    if (trimmed === "") {
      onChange?.("")
      return
    }

    let parsed: Date | undefined
    // try parseISO first
    try {
      const p = parseISO(trimmed)
      if (isValid(p)) parsed = p
    } catch {
      parsed = undefined
    }

    const fallbackFormats = [
      DISPLAY_FORMAT,
      "yyyy-MM-dd",
      "yyyy-M-d",
      "MM/dd/yyyy",
      "M/d/yyyy",
      "yyyy/MM/dd",
      "MMM d, yyyy",
      "MMMM d, yyyy",
    ]

    if (!parsed || !isValid(parsed)) {
      for (const fmt of fallbackFormats) {
        try {
          const p = parse(trimmed, fmt, new Date())
          if (isValid(p)) {
            parsed = p
            break
          }
        } catch {
          // ignore
        }
      }
    }

    if (parsed && isValid(parsed)) {
      const iso = format(parsed, "yyyy-MM-dd")
      const display = format(parsed, DISPLAY_FORMAT)
      setInputValue(display)
      onChange?.(iso)
    }
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      {/* Use Anchor to position popover relative to the full input container, not just the trigger button */}
      <PopoverPrimitive.Anchor asChild>
        <div className="relative">
          <Input
            ref={inputRef}
            value={inputValue}
            placeholder={placeholder ?? "Jan/01/2024"}
            className="pr-10"
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => {
              blurTimeout.current = window.setTimeout(() => {
                applyTypedValue()
                setOpen(false)
              }, 150)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyTypedValue()
                e.preventDefault()
              }
            }}
            aria-expanded={open}
          />

          {/* Make the icon button the Popover Trigger so input clicks remain normal */}
          <PopoverPrimitive.Trigger asChild>
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
              aria-label="Toggle calendar"
              onMouseDown={(e) => {
                // Prevent input blur when clicking the icon
                e.preventDefault()
                e.stopPropagation()
                // Clear any pending blur timeout immediately
                if (blurTimeout.current) {
                  window.clearTimeout(blurTimeout.current)
                  blurTimeout.current = null
                }
              }}
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </PopoverPrimitive.Trigger>

        </div>
      </PopoverPrimitive.Anchor>

      {/* Render the popover in a Portal to ensure proper z-index stacking */}
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="bottom"
          align="start"
          sideOffset={8}
          className="z-[100] rounded-md border bg-popover p-0 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          onPointerEnter={() => {
            if (blurTimeout.current) window.clearTimeout(blurTimeout.current)
          }}
          onPointerLeave={() => {
            // close shortly after pointer leaves the popover if input isn't focused
            if (document.activeElement !== inputRef.current) {
              blurTimeout.current = window.setTimeout(() => setOpen(false), 150)
            }
          }}
        >
          <div ref={popoverRef}>
            <Calendar mode="single" selected={value ? new Date(value) : undefined} onSelect={handleSelect} />
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
