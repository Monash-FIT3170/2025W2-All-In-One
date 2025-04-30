// Azure authentication dependency
import { BlobServiceClient, ContainerClient, ContainerCreateResponse, StoragePipelineOptions, StorageRetryPolicyType } from '@azure/storage-blob';
const connStr = process.env.AZURE_CONNECTION_STRING;
const defaultContainerName = "property-media-dev";
export let blobServiceClient: BlobServiceClient;
export const options: StoragePipelineOptions = {
  retryOptions: {
    maxTries: 4,
    retryDelayInMs: 3 * 1000,
    maxRetryDelayInMs: 120 * 1000,
    retryPolicyType: StorageRetryPolicyType.EXPONENTIAL
  },
};

export type UploadResult = {
  blobName: string; 
  success: boolean;
  url?: string;
  error?: string;
}
export type UploadResults = {
  success: UploadResult[];
  failed: UploadResult[];
}

try {
  if (!connStr) {
    throw new Error("Azure connection string is undefined");
  }
  blobServiceClient = BlobServiceClient.fromConnectionString(connStr, options);
} catch (e) {
  console.error("Failed to create BlobServiceClient:", e);
  throw new Error("Could not initialize BlobServiceClient.");
}

export async function getContainerClient(containerName: string = defaultContainerName): Promise<ContainerClient> {
  console.log("Getting Container Client");
  try {
    const client: ContainerClient = await blobServiceClient.getContainerClient(containerName);
    console.log(`Fetched container client: ${client.containerName}`);
    return client;

  } catch (e) {
    console.error("Failed to get container client:", e);
    throw new Error("Could not retrieve container client.");
  }
}
export async function createContainer(blobServiceClient: BlobServiceClient,containerName: string): Promise<ContainerClient> {
  
  const {containerClient,containerCreateResponse} : 
  {containerClient: ContainerClient; containerCreateResponse: ContainerCreateResponse; }
  = await blobServiceClient.createContainer(containerName);

  if (containerCreateResponse.errorCode)
    throw Error(`Failed to create container, error code: ${containerCreateResponse.errorCode}`);
  
  console.log(`Created container "${containerName}" successfully`); 
  return containerClient;
}

export async function uploadFile(containerClient: ContainerClient, blobName: string, blob: Blob): Promise<UploadResult>{
  const blobBlockClient = containerClient.getBlockBlobClient(blobName);
  try {
      await blobBlockClient.uploadData(blob, {
        blobHTTPHeaders: {
          blobContentType:  blob.type, 
        }
      });
      console.log(`Uploaded blob "${blobName}" successfully, URL: ${blobBlockClient.url}`);
      return {
        blobName,
        success: true,
        url: blobBlockClient.url,
      };
  } catch(e) {
      console.log(`Failed to upload blob "${blobName}":`, e);
      return {
        blobName,
        success: false,
        error: (e as Error).message ?? "Unknown error",
      };
  }
}
export async function uploadFiles(containerClient: ContainerClient, blobs: Blob[],blobNamePrefix: string = 'blob'  ): Promise<UploadResults>{

  // Collect uploadFile promises in array
  const uploadPromises = blobs.map((blob, index) => {
    const blobName = `${blobNamePrefix}-${Date.now()}-${index}`;
    return uploadFile(containerClient, blobName, blob);
  });

  // Execute all Promises
  const uploadResults = await Promise.all(uploadPromises);
  return {
    success: uploadResults.filter(result => result.success),
    failed: uploadResults.filter(result => !result.success)
  }
  

}