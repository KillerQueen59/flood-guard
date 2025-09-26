"use client";

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex mx-auto min-h-screen bg-primary-10 overflow-auto text-gray-100">
      {children}
    </div>
  );
}
