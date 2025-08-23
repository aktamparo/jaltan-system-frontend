"use client"
import { Button } from "@/components/ui/button"

export default function ViewUser() {

    return (
        <Button
            className="flex flex-col items-start gap-1 p-6 bg-transparent border-none shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
          >
            <span className="text-s text-black">View All Users</span>
            <span className="text-s text-gray-500">
              See all registered users and their access levels
            </span>
          </Button>
    )
}