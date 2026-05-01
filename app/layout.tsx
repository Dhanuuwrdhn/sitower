import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "SITOWER – Sistem Informasi Tower Transmisi",
  description: "Sistem Informasi Tower Transmisi PLN",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-white text-slate-900 antialiased">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
