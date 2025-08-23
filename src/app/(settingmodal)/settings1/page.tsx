"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import RequestCard from "@/components/ui/requestcard";
import CustomCircle from "@/components/ui/circle";
import { columns as ViewColumns, type User } from "../../../components/ui/userViewComponents/columns";
import { DataTable as ViewTable } from "../../../components/ui/userViewComponents/user-view-table";
import { getColumns as EditColumns } from "../../../components/ui/userEditComponents/columns";
import { DataTable as EditTable } from "../../../components/ui/userEditComponents/user-view-table";

import React from "react";

export default function SettingsPage() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const data: User[] = [
    {
      id: "728ed52f",
      email: "m@example.com",
      firstName: "Mark",
      lastName: "Iglesias",
      contactNumber: "09123456789",
      branch: "Main Branch",
      role: "STAFF",
      status: "ACTIVE",
    },
    {
      id: "728ed52g",
      email: "jane@example.com",
      firstName: "Jane",
      lastName: "Smith",
      contactNumber: "09998887777",
      branch: "Branch 2",
      role: "ADMIN",
      status: "INACTIVE",
    },
  ];

  return (
    <>
 
      <div className="w-full py-10">
        <ViewTable columns={ViewColumns} data={data} />
      </div>


      <div className="w-full py-10">
        <EditTable columns={EditColumns(selectedId, setSelectedId)} data={data} />
      </div>
      <Button type="submit" className="" >
                Edit
        </Button>
   
    </>
  );
}