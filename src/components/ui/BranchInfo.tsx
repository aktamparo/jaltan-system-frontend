"use client"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"

export default function BranchInfo() {

    return (
        <Card className="ml-6 h=10 w=full gap-1 bg-transparent border-none shadow-none p-0">
            <CardTitle className="text-s">Branch Information</CardTitle>
            <CardDescription className="text-s text-gray-500">
              You are currently managing: chuchu
            </CardDescription>
          </Card>
    )
}