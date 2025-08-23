import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#eceef7]">
      <div className="bg-white rounded-xl flex w-full m-6 flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}