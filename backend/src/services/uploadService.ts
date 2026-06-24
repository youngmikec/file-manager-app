import { FileStatus } from "@prisma/client";
import { prisma } from "../config/db/client.js";
import { AppError } from "../helpers/error.js";
import { generateFileStorageKey, generateUploadUrl, isFileSizeValid } from "../helpers/minio-storage.js";
import type { UploadFileRequest } from "../validationSchemas/index.js";
import { storageClient } from "../config/storage/minio.js";


export const initiateUploadService = async (
  data: UploadFileRequest,
  userId: string
) => {
  try {
    const uploads = await Promise.all(
      data.files.map(async (fileData) => {
        if (!isFileSizeValid(fileData.fileSize)) {
          throw new AppError(
            400,
            "INVALID_FILE_SIZE",
            `${fileData.fileName} exceeds maximum allowed size`
          );
        }

        const file = await prisma.file.create({
          data: {
            filename: fileData.fileName,
            size: fileData.fileSize,
            status: "PENDING",
            ownerId: userId,
            folderId: fileData.folderId ?? null,
            storageKey: "", // temporary
          },
        });

        const storageKey = generateFileStorageKey({
          userId,
          fileId: file.id,
          filename: file.filename,
        });

        const uploadUrl = await generateUploadUrl(storageKey);

        const updatedFile = await prisma.file.update({
          where: {
            id: file.id,
          },
          data: {
            storageKey,
          },
        });

        return {
          fileId: updatedFile.id,
          filename: updatedFile.filename,
          size: updatedFile.size,
          storageKey,
          uploadUrl,
          status: updatedFile.status,
        };
      })
    );

    return {
      uploads,
    };
  } catch (error: any) {
    throw new AppError(
      error.statusCode || 500,
      error.code || "SERVER_ERROR",
      error.message
    );
  }
};

export async function completeUploadService(
  fileId: string,
  userId: string
) {
  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      ownerId: userId,
      deletedAt: null,
    },
  });

  if (!file) {
    throw new Error("File not found");
  }

  try {
    const response = await storageClient.statObject(
      process.env.MINIO_BUCKET!,
      file?.storageKey ?? ''
    );

    const updatedFile = await prisma.file.update({
      where: {
        id: file.id,
      },
      data: {
        status: FileStatus.READY,
      },
    });

    return updatedFile;
  } catch {
    return file;
  }
}