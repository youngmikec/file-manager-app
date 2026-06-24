import { z } from 'zod';

export const authSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
});

export const createFolderSchema = z.object({
    name: z.string().min(1),
    parentId: z.string().trim().min(8).optional()
});

export const fileSchema = z.object({
    fileName: z.string().min(1),
    fileSize: z.number(),
    folderId: z.string().trim().min(8).optional()
});

export const uploadFileSchema = z.object({
    files: z.array(fileSchema).min(1)
})

export type AuthRequest = z.infer<typeof authSchema>;
export type CreateFolderRequest = z.infer<typeof createFolderSchema>;
export type UploadFileRequest = z.infer<typeof uploadFileSchema>;