import { env } from "../config/env.js";
import { storageClient } from "../config/storage/minio.js";


export const ensureBucketExists = async () => {
  const exists = await storageClient.bucketExists(
    env.MINIO_BUCKET
  );

  if (!exists) {
    await storageClient.makeBucket(
      env.MINIO_BUCKET,
      "us-east-1"
    );
  }
}

export const generateFileStorageKey = (params: {
  userId: string;
  fileId: string;
  filename: string;
}): string => {
  const sanitizedFilename = params.filename
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");

  return `users/${params.userId}/files/${params.fileId}/${sanitizedFilename}`;
}

export const generateUploadUrl = async (
  storageKey: string
) => {
  return storageClient.presignedPutObject(
    env.MINIO_BUCKET,
    storageKey,
    60 * 60 // 1 hour
  );
}

type ByteUnit = "B" | "KB" | "MB" | "GB" | "TB";

const BYTE_MULTIPLIERS: Record<ByteUnit, number> = {
    B:  1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
};

export const isFileSizeValid = (
    fileSize: number,
    maxSize: number = 10,
    unit: ByteUnit = "MB"
): boolean => {
    const maxSizeBytes = maxSize * BYTE_MULTIPLIERS[unit];
    return fileSize <= maxSizeBytes;
};