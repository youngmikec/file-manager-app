import { AppError } from "../helpers/error.js";
import { prisma } from "../config/db/client.js";
import type { CreateFolderRequest } from "../validationSchemas/index.js";


export const getRootFolderService = async (userId: string) => {
    try {
        const [rootFolders, rootFiles] = await prisma.$transaction([
            prisma.folder.findMany({
                where: {
                    ownerId: userId,
                    parentId: null,
                    deletedAt: null
                }
            }),
            prisma.file.findMany({
                where: {
                    ownerId: userId,
                    folderId: null,
                    deletedAt: null
                }
            })
        ]);

        return { 
            folders: rootFolders,
            files: rootFiles,
        };
    } catch (error: any) {
        throw new AppError(500, 'SERVER_ERROR', error.message);
    }
}

export const getSingleFolderService = async (folderId: string, userId: string) => {
    try {
        const folder = await prisma.folder.findFirst({
            where: {
                id: folderId,
                ownerId: userId,
                deletedAt: null
            },
            include: {
                children: true,
                files: true,
                owner: {
                    select: {
                        id: true,
                        email: true
                    }
                }
            }
        });

        return folder;
    } catch (error: any) {
        throw new AppError(500, 'SERVER_ERROR', error.message);
    }
}

export const createFolderService = async (data: CreateFolderRequest, userId: string) => {
    try {
        const folder = await prisma.folder.create({
            data: {
                name: data.name,
                ownerId: userId,
                parentId: data.parentId ?? null,
                deletedAt: null,
                createdAt: new Date()
            }
        });

        if (!folder) {
            throw new AppError(500, 'SERVER_ERROR', 'Folder not created.');
        }

        return folder;
    } catch (error: any) {
        throw new AppError(500, 'SERVER_ERROR', error.message);
    }
}

export const deleteFolderService = async (folderId: string, userId: string) => {
    try {
        // ── Recursively collect all child folder IDs ───────────────────────
        const collectChildFolderIds = async (parentId: string): Promise<string[]> => {
            const children = await prisma.folder.findMany({
                where: {
                    parentId,
                    ownerId: userId,
                    deletedAt: null,
                },
                select: { id: true },
            });

            const childIds = children.map((c) => c.id);

            const nestedIds = await Promise.all(
                childIds.map((id) => collectChildFolderIds(id))
            );

            return [parentId, ...childIds, ...nestedIds.flat()];
        };

        const allFolderIds = await collectChildFolderIds(folderId);

        // ── Soft delete all folders and their files in parallel ───────────
        const deletedAt = new Date();

        const [deletedFolders, deletedFiles] = await Promise.all([
            prisma.folder.updateMany({
                where: {
                    id: { in: allFolderIds },
                    ownerId: userId,
                    deletedAt: null,
                },
                data: { deletedAt },
            }),
            prisma.file.updateMany({
                where: {
                    folderId: { in: allFolderIds },
                    ownerId: userId,
                    deletedAt: null,
                },
                data: { deletedAt },
            }),
        ]);

        return {
            deletedFolderCount: deletedFolders.count,
            deletedFileCount: deletedFiles.count,
        };
    } catch (error: any) {
        throw new AppError(500, 'SERVER_ERROR', error.message);
    }
};

export const deleteFileService = async (fileId: string, userId: string) => {
    try {
        const deletedFolder = await prisma.file.update({
            where: {
                id: fileId,
                ownerId: userId,
                deletedAt: null
            },
            data: {
                deletedAt: new Date()
            }
        });

        if (!deletedFolder) {
            throw new AppError(500, 'SERVER_ERROR', 'File delete not successful.');
        }
        return deletedFolder;
    } catch (error: any) {
        throw new AppError(500, 'SERVER_ERROR', error.message);
    }
}