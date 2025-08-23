"use client"
import { Button } from "@/components/ui/button"

export default function AddUser() {

    return (
        <Button
            className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
          >
            <span className="text-s text-black">Add New User</span>
            <span className="text-s text-gray-500">
              Register a new branch manager or authorized staff into the system
            </span>
          </Button>
    )
}