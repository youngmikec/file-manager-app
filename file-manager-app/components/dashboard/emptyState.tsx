import { FileX } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FileX size={48} className="text-gray-300 mb-4" />
      <p className="text-gray-700 font-medium">You do not have any folders</p>
      <p className="text-gray-400 text-sm mt-1">
        Create a folder to get started.
      </p>
    </div>
  );
}