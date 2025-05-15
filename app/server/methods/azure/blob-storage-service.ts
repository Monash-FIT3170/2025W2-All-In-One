// Azure authentication dependency
import { BlobServiceClient, ContainerClient, ContainerCreateResponse, StoragePipelineOptions, StorageRetryPolicyType,ContainerCreateOptions } from '@azure/storage-blob';
import { UploadResult } from '/app/shared/azure/blob-models'
import dotenv from "dotenv"
const defaultContainerName = "property-media-dev";
dotenv.config({path: `${process.env.PWD}/.env`})
export const options: StoragePipelineOptions = {
  retryOptions: {
    maxTries: 4,
    retryDelayInMs: 3 * 1000,
    maxRetryDelayInMs: 120 * 1000,
    retryPolicyType: StorageRetryPolicyType.EXPONENTIAL
  },
};


export function getBlobServiceClient(): BlobServiceClient {
  const connStr = process.env.AZURE_CONNECTION_STRING
  console.log("Getting Blob Service Client");
  try {
    if (!connStr) {
      throw new Error("Azure connection string is undefined");
    }
    const blobServiceClient: BlobServiceClient = BlobServiceClient.fromConnectionString(connStr, options);
    console.log("Fetched Blob Service Client");
    return blobServiceClient;
  } catch (e) {
    console.error("Failed to get Blob Service Client:", e);
    throw new Error("Could not retrieve Blob Service Client.");
  }
}

export async function getContainerClient(containerName: string = defaultContainerName): Promise<ContainerClient> {
  const blobServiceClient: BlobServiceClient = getBlobServiceClient();
  console.log("Getting Container Client");
  try {
    const client: ContainerClient = await blobServiceClient.getContainerClient(containerName);
    console.log(`Fetched Container Client: ${client.containerName}`);
    return client;

  } catch (e) {
    console.error("Failed to get container client:", e);
    throw new Error("Could not retrieve container client.");
  }
}
export async function createContainer(containerName: string): Promise<ContainerClient> {
  const options: ContainerCreateOptions = {
    access: "blob"
  }
  const blobServiceClient: BlobServiceClient = getBlobServiceClient();
  const {containerClient,containerCreateResponse} : 
  {containerClient: ContainerClient; containerCreateResponse: ContainerCreateResponse; }
  = await blobServiceClient.createContainer(containerName,options);

  if(containerCreateResponse.errorCode){
    switch(containerCreateResponse.errorCode){
      case "409":
        console.log(`Container "${containerName}" already exists`); 
        return await getContainerClient(containerName)
    }
    throw new Error(`Failed to create container "${containerName}": ${containerCreateResponse.errorCode}`); 
  }
  console.log(`Created container "${containerName}" successfully`); 
    return containerClient;

}

export async function uploadFile(containerClient: ContainerClient, blobName: string, blob: Buffer,blobContentType: string): Promise<UploadResult>{
  const blobBlockClient = containerClient.getBlockBlobClient(blobName);
  try {
      const response = await blobBlockClient.uploadData(blob, {
        blobHTTPHeaders: {
          blobContentType: blobContentType,
        }
      });
      console.log(`Uploaded blob "${blobName}" successfully, URL: ${blobBlockClient.url}`);
      return {
        blobName,
        success: true,
        url: blobBlockClient.url,
        response: response
        };
  } 
  catch(e) {
    if (e instanceof Error)
      { console.log(`Failed to upload blob "${blobName}":`, e.message);
        return {
          blobName,
          success: false,
          error: e.message ?? "Unknown error",
        };
      }
      else {
        console.log(`Failed to upload blob "${blobName}":`, e);
        return {
          blobName,
          success: false,
          error: "Unknown error",
        };
      }
  }
}

