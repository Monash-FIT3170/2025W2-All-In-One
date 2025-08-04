import { BlobUploadCommonResponse } from "@azure/storage-blob";

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
    PHOTO = 'photo/',
}

const dummySuccess1: UploadResultSuccess = {
  blobName: "property/-1748400481798-0-house1.jpg",
  success: true,
  url: "https://allinonepropertymediadev.blob.core.windows.net/property-media-dev/property/-1748400481798-0-house1.jpg",
  response: {} as BlobUploadCommonResponse,
};

const dummySuccess2: UploadResultSuccess = {
  blobName: "property/-1748402898829-1-house2.jpg",
  success: true,
  url: "https://allinonepropertymediadev.blob.core.windows.net/property-media-dev/property/-1748402898829-1-house2.jpg",
  response: {} as BlobUploadCommonResponse,
};

export const dummyUploadResults: UploadResults = {
  success: [dummySuccess1, dummySuccess2],
  failed: [],
};