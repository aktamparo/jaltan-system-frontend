"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import RequestCard from "@/components/ui/requestcard";

export default function DashboardPage() {
  return (
    <>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-xl font-medium m-0">Dashboard</h1>
        <Button type="submit">Recent Requests</Button>
      </div>

      <div className="w-full py-4 flex flex-col gap-10">
        <div className="text-xl font-medium text-center">Requests</div>
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-1 lg:grid-cols-3">
          <RequestCard title="Completed" variant="Completed" />
          <RequestCard title="Pending" variant="Pending" />
          <RequestCard title="Cancelled" variant="Cancelled" />
        </div>
      </div>

      <div className="w-full py-4 flex flex-col gap-10">
        <div className="text-xl font-medium text-center">Stocks</div>
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-1 lg:grid-cols-3">
          <Card className="h-32 shadow-md rounded-2xl bg-[#f5e9e8] w-full mx-auto">
            <CardHeader className="gap-6 flex flex-row items-center text-black text-lg font-medium justify-center">
              High
            </CardHeader>
          </Card>

          <Card className="h-32 shadow-md rounded-2xl bg-[#f5e9e8] w-full mx-auto">
            <CardHeader className="gap-6 flex flex-row items-center text-black text-lg font-medium justify-center">
              Low
            </CardHeader>
          </Card>

          <Card className="h-32 shadow-md rounded-2xl bg-[#f5e9e8] w-full mx-auto">
            <CardHeader className="gap-6 flex flex-row items-center text-black text-lg font-medium justify-center">
              Out
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  );
}
