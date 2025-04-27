import { Meteor } from 'meteor/meteor';
import { getContainerClient } from '../app/server/azure/blobStorageService';
console.log("✅ blobs.list method file loaded");


Meteor.methods({
  // Method to upload blob
  async 'blobs.upload'(data: any) {
    try {
      console.log("Uploading...")
      // Your blob upload logic here using containerClient
      const content = "Hello";
      const contentBuffer = Buffer.from(content, "utf-8");
      const containerClient = await getContainerClient();
      const blockBlobClient = containerClient.getBlockBlobClient("hello.txt");
      await blockBlobClient.upload(contentBuffer,contentBuffer.length);
      console.log("Upload Complete")
      // ... rest of your upload logic
      return { success: true };
    } catch (error) {
        if (error instanceof Error) {
          throw new Meteor.Error('blob-upload-failed', error.message);
        } else {
          throw new Meteor.Error('blob-upload-failed', 'Unknown error occurred');
        }
      }
    },

  // Method to download blob
  async 'blobs.download'(blobName: string) {
    try {
      const containerClient = await getContainerClient();
      const blobClient = containerClient.getBlobClient(blobName);
      // ... your download logic
      return { success: true };
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
      console.log("BLOBS!!!!!")
      const containerClient = await getContainerClient();
      const blobs = [];
      for await (const blob of containerClient.listBlobsFlat()) {
        blobs.push(blob.name);
      }
      return ["WE DID IT"]
      // return blobs;
    } catch (error) {
        if (error instanceof Error) {
          throw new Meteor.Error('blob-upload-failed', error.message);
        } else {
          throw new Meteor.Error('blob-upload-failed', 'Unknown error occurred');
        }
      }      
  },
});
