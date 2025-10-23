import {UploadResults, FileInfo,isValidBlobContentType, BlobNamePrefix, UploadResult } from '/app/shared/azure/blob-models'
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";
import { BlobUploadCommonResponse } from "@azure/storage-blob";

export async function uploadFileHandler(blob: Blob, blobName: string): Promise<UploadResult>{
    if (Meteor.isDevelopment) {
      console.warn("Development mode: Creating blob URL instead of uploading.");
      
      // In development mode, create blob URL to preserve actual uploaded image
      return {
          blobName: `dev-${Date.now()}-${blobName}`,
          success: true as const,
          url: URL.createObjectURL(blob),
          response: {} as BlobUploadCommonResponse // Mock response for development
      };
    }

    const uint8Array = await blobToUint8Array(blob)

    const uploadResult: UploadResult = await Meteor.callAsync(MeteorMethodIdentifier.BLOB_UPLOAD_FILE, uint8Array, blobName,blob.type)
    return uploadResult;
}

export async function uploadFilesHandler(blobs: File[], blobNamePrefix: BlobNamePrefix): Promise<UploadResults>{
  
  if (Meteor.isDevelopment) {
    console.warn("Development mode: Creating blob URLs instead of uploading.");
    
    // In development mode, create blob URLs to preserve actual uploaded images
    const developmentResults: UploadResults = {
      success: blobs.map(file => ({
        blobName: `${blobNamePrefix}dev-${Date.now()}-${file.name}`,
        success: true as const,
        url: URL.createObjectURL(file),
        response: {} as BlobUploadCommonResponse // Mock response for development
      })),
      failed: []
    };
    
    return developmentResults;
  }
  
  const files: FileInfo[] = await Promise.all(
        blobs.map(async (file) => {
          const uint8Array = await blobToUint8Array(file);

          if (!isValidBlobContentType(file.type)) { throw new Meteor.Error(`Unsupported file type: ${file.type}`)}
          return {
            data: uint8Array,
            name: file.name, 
            type: file.type,
          };
        })
      );
      const uploadResults: UploadResults = await Meteor.callAsync(MeteorMethodIdentifier.BLOB_UPLOAD_FILES, files, blobNamePrefix)
    

    return uploadResults

}

export async function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
    const arrayBuffer = await blob.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }

export function getImageUrlsFromUploadResults(uploadResults: UploadResults): string[] {
    if (uploadResults.failed.length > 0) {
        console.error("Failed to upload some files:", uploadResults.failed);
        throw new Meteor.Error(`File upload failed. Please try again.`);
    }
    return uploadResults.success.map((uploadResult) => uploadResult.url);
}

