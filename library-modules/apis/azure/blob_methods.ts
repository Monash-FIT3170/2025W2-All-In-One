import { Meteor } from 'meteor/meteor';
import { getContainerClient, uploadFile,  } from './blobStorageService';
console.log("✅ blobs.list method file loaded");


Meteor.methods({
  // Method to upload blob
  async 'blobs.uploadFile'(
    blobData: number[],
    blobName: string,
    blobContentType: string,
    containerClientName: string) {
    try {
      console.log("Uploading...")
      const blob = Buffer.from(blobData);


      const containerClient = await getContainerClient(containerClientName);
      const uploadResult = await uploadFile(containerClient, blobName, blob,blobContentType);
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
    blobData: { data: Uint8Array; name: string; type: string }[],
    blobNamePrefix: string,
    containerClientName: string) {
      try {
        const containerClient = await getContainerClient(containerClientName);
  
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

  },

  // Method to list blobs
  async 'blobs.list'() {
    try {
      const containerClient = await getContainerClient();
      const blobs = [];
      for await (const blob of containerClient.listBlobsFlat()) {
        blobs.push(blob.name);
      }
      return blobs;
    } catch (error) {
        if (error instanceof Error) {
          throw new Meteor.Error('blob-upload-failed', error.message);
        } else {
          throw new Meteor.Error('blob-upload-failed', 'Unknown error occurred');
        }
      }      
  },
});
