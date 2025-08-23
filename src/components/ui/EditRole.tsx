"use client"
import { Button } from "@/components/ui/button"

export default function EditRole() {

    return (
        <Button
            className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
          >
            <span className="text-s text-black">Edit User Role</span>
            <span className="text-s text-gray-500">
              Update a user's system role or branch assignment
            </span>
          </Button>
    )
}