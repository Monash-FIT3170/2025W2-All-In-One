import { Meteor } from 'meteor/meteor';
import { getContainerClient, uploadFile,  } from './blob-storage-service';
import { BlobContentType, BlobNamePrefix, FileInfo, UploadResults, UploadResult } from '/app/shared/azure/blob-models'
import { MeteorMethodIdentifier } from '/app/shared/meteor-method-identifier';

const blobUploadFileMethod = {
  [MeteorMethodIdentifier.BLOB_UPLOAD_FILE] : async (
    blobData: Uint8Array<ArrayBufferLike>,
    blobName: string,
    blobContentType: BlobContentType): Promise<UploadResult> => {
    try {
      console.log("Uploading...")
      const blob = Buffer.from(blobData);
      

      const containerClient = await getContainerClient();
      const uploadResult: UploadResult = await uploadFile(containerClient, blobName, blob,blobContentType);
        return uploadResult; 
    } catch (error) {
        if (error instanceof Error) {
          throw new Meteor.Error('blob-upload-failed', error.message);
        } else {
          throw new Meteor.Error('blob-upload-failed', 'Unknown error occurred');
        }
      }
    }
}

const blobUploadFilesMethod = {
  [MeteorMethodIdentifier.BLOB_UPLOAD_FILES]: async (
    blobData: FileInfo[],
    blobNamePrefix: BlobNamePrefix,): Promise<UploadResults> => {
      try {
        const containerClient = await getContainerClient();
  
        const uploadResults = await Promise.all(
          blobData.map(async (blob, index) => {
            const buffer = Buffer.from(blob.data);
            const blobName = `${blobNamePrefix}-${Date.now()}-${index}-${blob.name}`;
            return await uploadFile(containerClient, blobName, buffer, blob.type);
          })
        );
  
        return {
          success: uploadResults.filter(uploadResult => uploadResult.success),
          failed: uploadResults.filter(uploadResult => !uploadResult.success),
        };
    } catch (error) {
        if (error instanceof Error) {
          throw new Meteor.Error('blob-upload-failed', error.message);
        } else {
          throw new Meteor.Error('blob-upload-failed', 'Unknown error occurred');
        }
      }

    }
}

Meteor.methods({
  ...blobUploadFileMethod,
  ...blobUploadFilesMethod
})