import { BlobUploadCommonResponse } from "@azure/storage-blob";

export type UploadResult = {
    blobName: string; 
    success: boolean;
    url?: string;
    error?: string;
    response?: BlobUploadCommonResponse;
  }
export type UploadResults = {
    success: UploadResult[];
    failed: UploadResult[];
  }
export type FileInfo = {
    data: Uint8Array<ArrayBufferLike>,
    name: string,
    type: BlobContentType
}
export const AllowedBlobContentType = [
    'image/png',
    'image/jpeg',
    'application/pdf',
    'text/plain',
    'video/mp4',
] as const;
export type BlobContentType = typeof AllowedBlobContentType[number]

export function isValidBlobContentType(type: string): type is BlobContentType {
  return (AllowedBlobContentType as readonly string[]).includes(type);
}
