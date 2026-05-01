"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  ShieldAlert,
  History,
  FileText,
  Database,
  Zap,
  Wrench,
  ChevronDown,
  ChevronRight,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const historyItems = [
  { label: "Gangguan", href: "/history/gangguan", icon: ShieldAlert },
  { label: "Petir", href: "/history/petir", icon: Zap },
  { label: "Pergantian", href: "/history/pergantian", icon: Wrench },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [historyOpen, setHistoryOpen] = useState(
    pathname.startsWith("/history")
  );

  const navItem = (href: string, label: string, Icon: React.ElementType) => (
    <Link
      key={href}
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
        pathname === href
          ? "bg-blue-600 text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <Icon size={16} />
      {label}
    </Link>
  );

  return (
    <aside className="w-60 shrink-0 border-r border-slate-200 bg-white flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-slate-200">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <Radio size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-none">SITOWER</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Sistem Informasi Tower</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItem("/dashboard", "Dashboard", LayoutDashboard)}
        {navItem("/peta", "Peta Tower", Map)}
        {navItem("/kerawanan", "Kerawanan Sosial", ShieldAlert)}

        {/* History group */}
        <div>
          <button
            onClick={() => setHistoryOpen((v) => !v)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith("/history")
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <span className="flex items-center gap-3">
              <History size={16} />
              History
            </span>
            {historyOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {historyOpen && (
            <div className="mt-1 ml-4 space-y-0.5 border-l border-slate-200 pl-3">
              {historyItems.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === href
                      ? "bg-blue-600 text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  )}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {navItem("/sertifikat", "Sertifikat", FileText)}
        {navItem("/aset", "Data Aset", Database)}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-200">
        <p className="text-[10px] text-slate-400">PLN UIW Banten — v1.0</p>
      </div>
    </aside>
  );
}
