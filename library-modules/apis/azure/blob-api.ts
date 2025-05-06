import { UploadResult, UploadResults } from "./blobStorageService";

type fileInfo = {
    data: Promise<Uint8Array<ArrayBufferLike>>,
    name: string,
    type: string
}
export async function viewBlobs(): Promise<string[]> {
    console.log("Calling blobs.list");
    const blobs: string[] = await Meteor.callAsync("blobs.list", null)
    return blobs;
}

export async function uploadFileHandler(blob: Blob, blobName: string, containerClientName: string = "property-media-dev") {
    console.log("Calling blobs.uploadFile");
    console.log(`blob: ${blob} ${await blob.text()}`)
    const uint8Array = await blobToUint8Array(blob)

    const uploadResult: UploadResult = await Meteor.callAsync("blobs.uploadFile", uint8Array, blobName,blob.type,containerClientName)
    return uploadResult;
}

export async function uploadFilesHandler(blobs: File[], blobNamePrefix: string, containerClientName: string = "property-media-dev"){
    console.log("Calling blobs.uploadFiles");
    const files: fileInfo[] = await Promise.all(
        blobs.map(async (file) => {
          const uint8Array = blobToUint8Array(file);
          return {
            data: uint8Array,
            name: file.name, 
            type: file.type,
          };
        })
      );
      const uploadResults: UploadResults = await Meteor.callAsync("blobs.uploadFiles", files, blobNamePrefix, containerClientName)
    

    return uploadResults

}

export async function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
    const arrayBuffer = await blob.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }