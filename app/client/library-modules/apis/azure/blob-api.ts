import { UploadResult, UploadResults, fileInfo } from "/app/client/library-modules/apis/azure/blob-model"
import { MeteorMethodIdentifier } from "/app/shared/meteor-method-identifier";

export async function uploadFileHandler(blob: Blob, blobName: string, containerClientName: string = "property-media-dev") {
    const uint8Array = await blobToUint8Array(blob)

    const uploadResult: UploadResult = await Meteor.callAsync(MeteorMethodIdentifier.BLOB_UPLOAD_FILE, uint8Array, blobName,blob.type,containerClientName)
    return uploadResult;
}

export async function uploadFilesHandler(blobs: File[], blobNamePrefix: string, containerClientName: string = "property-media-dev"){
    const files: fileInfo[] = await Promise.all(
        blobs.map(async (file) => {
          const uint8Array = await blobToUint8Array(file);
          return {
            data: uint8Array,
            name: file.name, 
            type: file.type,
          };
        })
      );
      console.log(files)
      const uploadResults: UploadResults = await Meteor.callAsync(MeteorMethodIdentifier.BLOB_UPLOAD_FILES, files, blobNamePrefix, containerClientName)
    

    return uploadResults

}

export async function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
    const arrayBuffer = await blob.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }