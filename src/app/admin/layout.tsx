"use client";

import { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import Navbar from "@/components/layouts/Navbar";
import { GlobalProgressBar } from "@/components/layouts/GlobalProgressBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground font-sans selection:bg-accent">
      <GlobalProgressBar />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`flex h-dvh min-w-0 flex-1 flex-col overflow-hidden transition-[margin] duration-base ease-out ${
          isSidebarOpen ? "lg:ml-[17rem]" : "lg:ml-20"
        }`}
      >
        <Navbar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          role="admin"
          identityLabel="Administrator"
          identityInitials="AD"
        />
        <main className="min-h-0 flex-1 overflow-hidden p-4 sm:p-6">
          <div className="mx-auto h-full w-full max-w-[1800px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
