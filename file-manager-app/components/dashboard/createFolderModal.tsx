"use client";
import { useCreateFolder } from "@/hooks/folder-hooks";
import { CreateFolderRequest } from "@/validations/folder";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateFolderModal({ isOpen, onClose }: Props) {
  const [name, setName] = useState("");
  const params = useParams();
  const folderId = params['id'] as string;
  const { mutate: createFolder, isPending } = useCreateFolder();

  const handleSubmit = () => {
    if (!name.trim()) return;
    const payload: CreateFolderRequest = folderId ? { name: name.trim(), parentId: folderId } : { name: name.trim() };
    createFolder(
      { ...payload },
      {
        onSuccess: () => {
          toast.success("Folder created successfully");
          setName("");
          onClose();
        },
        onError: (error: Error) => {
          toast.error(
            error?.message || "Failed to create folder"
          );
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Create a Folder
        </h2>
        <input
          type="text"
          placeholder="Folder name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setName("");
              onClose();
            }}
            className="px-4 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || isPending}
            className="px-4 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}