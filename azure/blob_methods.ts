import { Meteor } from 'meteor/meteor';
import { getContainerClient, uploadFile, uploadFiles, UploadResults } from '../app/server/azure/blobStorageService';
console.log("✅ blobs.list method file loaded");


Meteor.methods({
  // Method to upload blob
  async 'blobs.uploadFile'(blob: Blob,blobName: string) {
    try {
      console.log("Uploading...")
      const containerClient = await getContainerClient();
      const uploadResult = await uploadFile(containerClient, blobName, blob);
        return uploadResult; 
    } catch (error) {
        if (error instanceof Error) {
          throw new Meteor.Error('blob-upload-failed', error.message);
        } else {
          throw new Meteor.Error('blob-upload-failed', 'Unknown error occurred');
        }
      }
    },

  async 'blobs.uploadFiles'(blobs: Blob[], blobNamePrefix: string) {
    try{
      const containerClient = await getContainerClient();
      const uploadResults: UploadResults = await uploadFiles(containerClient, blobs, blobNamePrefix);
      return uploadResults
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
