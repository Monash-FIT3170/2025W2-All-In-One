import { Meteor } from 'meteor/meteor';
import { getContainerClient, uploadFile,  } from './blobStorageService';
import { fileInfo, UploadResult, UploadResults } from './blobDTO';

Meteor.methods({
  // Method to upload blob
  async 'blobs.uploadFile'(
    blobData: Uint8Array<ArrayBufferLike>,
    blobName: string,
    blobContentType: string,
    containerClientName: string): Promise<UploadResult> {
    try {
      console.log("Uploading...")
      const blob = Buffer.from(blobData);


      const containerClient = await getContainerClient(containerClientName);
      const uploadResult: UploadResult = await uploadFile(containerClient, blobName, blob,blobContentType);
        return uploadResult; 
    } catch (error) {
        if (error instanceof Error) {
          throw new Meteor.Error('blob-upload-failed', error.message);
        } else {
          throw new Meteor.Error('blob-upload-failed', 'Unknown error occurred');
        }
      }
    },

  async 'blobs.uploadFiles'(
    blobData: fileInfo[],
    blobNamePrefix: string,
    containerClientName: string): Promise<UploadResults> {
      try {
        const containerClient = await getContainerClient(containerClientName);
  
        const uploadResults = await Promise.all(
          blobData.map(async (blob, index) => {
            const buffer = Buffer.from(blob.data);
            console.log(await buffer.buffer)
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

  },
});
