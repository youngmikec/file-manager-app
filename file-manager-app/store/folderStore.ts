import { create } from "zustand";
import type { Folder } from "@/types/folder";

interface FolderStore {
  // ── State ─────────────────────────────────────────────────────────────────
  folders: Folder[];
  currentFolder: Folder | null;

  setFolders: (folders: Folder[]) => void;
  addFolder: (folder: Folder) => void;

  // ── Current folder actions ────────────────────────────────────────────────
  setCurrentFolder: (folder: Folder | null) => void;
  addChildToCurrentFolder: (child: Folder) => void;

  // ── Reset ─────────────────────────────────────────────────────────────────
  reset: () => void;
}

const initialState = {
  folders: [],
  currentFolder: null,
};

export const useFolderStore = create<FolderStore>((set) => ({
  ...initialState,

  // ── Folders ───────────────────────────────────────────────────────────────
  setFolders: (folders) => set({ folders }),

  addFolder: (folder) =>
    set((state) => ({
      folders: [...state.folders, folder],
    })),

  // ── Current folder ────────────────────────────────────────────────────────
  setCurrentFolder: (folder) => set({ currentFolder: folder }),

  // When a new folder is created with a parentId matching currentFolder,
  // append it to currentFolder's children if the backend returns children
  // or just update the children count for display purposes
  addChildToCurrentFolder: (child) =>
    set((state) => {
      if (!state.currentFolder) return state;
      if (child.parentId !== state.currentFolder.id) return state;

      return {
        currentFolder: {
          ...state.currentFolder,
          children: [
            ...((state.currentFolder as Folder).children ?? []),
            child,
          ],
        },
      };
    }),

  // ── Reset ─────────────────────────────────────────────────────────────────
  reset: () => set(initialState),
}));