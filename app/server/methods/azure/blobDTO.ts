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
  export type fileInfo = {
    data: Uint8Array<ArrayBufferLike>,
    name: string,
    type: string
}