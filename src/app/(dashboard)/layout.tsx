import { redirect } from "next/navigation";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

import { auth } from "@/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }
  console.log(session);
  return (
    <div className="bg-muted h-full">
      <Sidebar />
      <div className="lg:pl-[300px] flex flex-col h-full">
        <Navbar />
        <main className="bg-white flex-1 overflow-auto p-8 lg:rounded-tl-2xl">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
