// Azure authentication dependency
import { BlobServiceClient, BlockBlobClient, ContainerClient, ContainerCreateResponse, newPipeline, StoragePipelineOptions, StorageRetryPolicyType } from '@azure/storage-blob';
console.log(process.env.AZURE_CLIENT_ID);
console.log(process.env.AZURE_TENANT_ID);
console.log(process.env.AZURE_CLIENT_SECRET);
const accountName = "allinonepropertymediadev";
const accountURL = `https://${accountName}.blob.core.windows.net`;
const containerName = "property-media-dev";
const connStr = process.env.AZURE_CONNECTION_STRING;
if (!connStr) {
  throw new Error("AZURE_CONNECTION_STRING is not set in environment variables.");
}
const options: StoragePipelineOptions = {
  retryOptions: {
    maxTries: 4,
    retryDelayInMs: 3 * 1000,
    maxRetryDelayInMs: 120 * 1000,
    retryPolicyType: StorageRetryPolicyType.EXPONENTIAL
  },
};


const blobServiceClient = BlobServiceClient.fromConnectionString(connStr,options);

export async function getContainerClient(): Promise<ContainerClient> {
  console.log("Getting Container Client");
  const client: ContainerClient = await blobServiceClient.getContainerClient(containerName);
  console.log("Conainer Client Retrieved")
  return client;
}
export async function createContainer(blobServiceClient: BlobServiceClient,containerName: string): Promise<ContainerClient> {
  
  const {containerClient,containerCreateResponse} : 
  {containerClient: ContainerClient; containerCreateResponse: ContainerCreateResponse; }
  = await blobServiceClient.createContainer(containerName);

  if (containerCreateResponse.errorCode)
    throw Error(containerCreateResponse.errorCode);

  return containerClient;
}

export async function uploadFile(containerClient: ContainerClient, blobName: string, blob: Blob){
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadData(blob);

}