"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import PoliceSidebar from "@/components/sidebar/PoliceSidebar";
import Navbar from "@/components/navbar/Navbar";

export default function PoliceLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* LEFT SIDEBAR */}
        <PoliceSidebar />

        {/* RIGHT CONTENT COLUMN */}
        <div className="flex flex-col flex-1 w-full">
          <Navbar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
