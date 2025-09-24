"use client";

import SideBar from "@/components/Sidebar/Sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full">
      <SideBar />
      {/* <LoadingModal /> */}
      <div className="w-full max-h-screen bg-primary-10 overflow-auto text-gray-100">
        {children}
      </div>
    </div>
  );
}
