import { Folder as FolderIcon } from "lucide-react";
import type { Folder } from "@/types/folder";

export default function FolderCard({ folder }: { folder: Folder }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-sm transition cursor-pointer">
      <FolderIcon size={20} className="text-purple-500" />
      <span className="text-sm text-gray-700 font-medium truncate">
        {folder.name}
      </span>
    </div>
  );
}