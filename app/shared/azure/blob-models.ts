import { BlobUploadCommonResponse } from "@azure/storage-blob";

// export type UploadResult = {
//     blobName: string; 
//     success: boolean;
//     url: string;
//     response?: BlobUploadCommonResponse;
//   }
export type UploadResult =  UploadResultSuccess | UploadResultFail; 

export type UploadResultSuccess = {
    blobName: string; 
    success: true;
    url: string;
    response: BlobUploadCommonResponse;    
}

export type UploadResultFail = {
    blobName: string; 
    success: false;
    error: string;
  }

export type UploadResults = {
    success: UploadResultSuccess[];
    failed: UploadResultFail[];
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


export enum BlobNamePrefix{
    PROPERTY = 'property/',
    DOCUMENT = 'document/',
}