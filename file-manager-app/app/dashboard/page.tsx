"use client";

import { useFolders } from "@/hooks/folder-hooks";
import FolderCard from "@/components/dashboard/foldercard";
import EmptyState from "@/components/dashboard/emptyState";
import { Folder } from "@/types";


export default function DashboardPage() {
  const { data, isLoading } = useFolders();

  return (
    <div>
        {/* Folders Section */}
        <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Folders
            </h2>
            {isLoading ? (
                <div className="text-sm text-gray-400">Loading folders...</div>
            ) : data?.folders && data?.folders.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                { data?.folders.map((folder: Folder) => (
                    <FolderCard key={folder.id} folder={folder} />
                ))
                }
                </div>
            ) : (
                <EmptyState />
            )}
        </div>
    </div>
  );
}