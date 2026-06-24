export interface Folder {
  id: string;
  name: string;
  ownerId: string;
  parentId: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RootFolderType { folders: Folder[], files: [] }