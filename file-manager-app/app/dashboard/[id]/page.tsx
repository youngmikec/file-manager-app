"use client";

import { useSingleFolder } from "@/hooks/folder-hooks";
import FolderCard from "@/components/dashboard/foldercard";
import EmptyState from "@/components/dashboard/emptyState";
import { Folder } from "@/types";
import { useParams } from "next/navigation";
import { useFolderStore } from "@/store/folderStore";


export default function DashboardPage() {
  const params = useParams();
  const folderId = params['id'] as string;

  const { isLoading } = useSingleFolder(folderId);
  const { currentFolder: data } = useFolderStore();

  return (
    <div>
        {/* Folders Section */}
        <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                { data?.name }
            </h2>
            {isLoading ? (
                <div className="text-sm text-gray-400">Loading folders...</div>
            ) : data?.children && data?.children.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                { data?.children.map((folder: Folder) => (
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