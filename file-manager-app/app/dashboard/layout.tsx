"use client";
import { useState } from "react";
import { FolderPlus, Upload } from "lucide-react";
import AuthGuard from "@/components/auth/authGuard";
import Sidebar from "@/components/dashboard/sidebar";
import CreateFolderModal from "@/components/dashboard/createFolderModal";


export default function DashboardLayout ({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Drive</h1>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-3 px-6 py-5 bg-white border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition text-purple-600 font-medium"
            >
              <FolderPlus size={22} />
              Create a folder
            </button>
            <button className="flex items-center gap-3 px-6 py-5 bg-white border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition text-purple-600 font-medium">
              <Upload size={22} />
              Upload a document
            </button>
          </div>

          { children }
        </main>

        <CreateFolderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </AuthGuard>
  );
}