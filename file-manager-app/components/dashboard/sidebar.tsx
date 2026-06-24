"use client";
import { HardDrive } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-100 px-4 py-6 flex flex-col gap-1">
      <div className="flex items-center gap-2 px-3 py-2 mb-4">
        <span className="text-purple-600 font-bold text-lg">Septa Drive</span>
      </div>
      <nav>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-purple-50 text-purple-600 font-medium text-sm">
          <HardDrive size={18} />
          My Drive
        </button>
      </nav>
    </aside>
  );
}