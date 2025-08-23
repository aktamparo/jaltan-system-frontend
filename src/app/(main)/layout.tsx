"use client";

import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import { ReactQueryClientProvider } from "@/components/providers/tanstack-query-provider";
import { useGetAccount } from "@/lib/queries/accountQueries";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <Content>{children}</Content>
    </ReactQueryClientProvider>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  const { data: account, isLoading, error } = useGetAccount();
  console.log("Account data:", account);

  if (isLoading) return <div>Loading account...</div>;
  if (error) return <div>Failed to load account</div>;

  return (
    <div className="min-h-screen flex bg-[#eceef7]">
      <div className="bg-white rounded-xl flex w-full m-6 flex-col">
        <Header account={account} />
        <div className="flex flex-1">
          <Sidebar account={account} />
          <div className="flex-1 p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
