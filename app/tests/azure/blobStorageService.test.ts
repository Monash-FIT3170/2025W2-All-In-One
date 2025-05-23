import { expect, jest } from "@jest/globals";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { createContainer, uploadFile } from "../../server/methods/azure/blob-storage-service";
import { blobToUint8Array } from "/app/client/library-modules/apis/azure/blob-api";
import { testBlob } from "./testBlob";
const mockUpload = jest.fn().mockImplementation(() => Promise.resolve({status:200}))
const mockedBlockBlobClient = {
    uploadData: mockUpload,
    url: 'https://mockstorage.blob.core.windows.net/container/test.txt'

}

 
const mockedContainerClient = {
    getBlockBlobClient: jest.fn( () => mockedBlockBlobClient),
} as unknown as ContainerClient;
let mockedContainerCreateResponse: { errorCode?: string } = {};

jest.mock('meteor/meteor', () => ({
  Meteor: {
    settings: {
      private: {
        AZURE_CONNECTION_STRING: 'test'
      }
    }
  }
}));
jest.mock("@azure/storage-blob",() => ({
    BlobServiceClient: {
        fromConnectionString: jest.fn(() => ({
            getContainerClient: mockedContainerClient,
            createContainer: jest.fn().mockImplementation(() => Promise.resolve({
                containerClient: mockedContainerClient,
                containerCreateResponse: mockedContainerCreateResponse
            })),
        }))
    } as unknown as BlobServiceClient,
    StorageRetryPolicyType: {
        EXPONENTIAL: 'EXPONENTIAL'
      },
}));



describe('uploadFile', () => {
    beforeEach(() => {
        jest.clearAllMocks();
      });

      
    it('should upload the file and return success result', async () => {
        const blobName = 'test';
        const blob = testBlob;
        const uint8Array = await blobToUint8Array(blob);
        const buffer: Buffer = Buffer.from(uint8Array) ;
        const uploadResult = await uploadFile(mockedContainerClient, blobName,buffer ,blob.type);

        expect(mockedContainerClient.getBlockBlobClient).toHaveBeenCalledWith(blobName);
        expect(mockUpload).toHaveBeenCalledWith(buffer, {
            blobHTTPHeaders: {
                blobContentType: blob.type,
            },
        });

        expect(uploadResult).toEqual({
            blobName,
            response: {status: 200},
            success: true,
            url: 'https://mockstorage.blob.core.windows.net/container/test.txt',
        });
    });
    it('should handle upload failure and return failure result', async () => {
        const blobName = 'test';
        const blob = testBlob;
        const uint8Array = await blobToUint8Array(blob);
        const buffer: Buffer = Buffer.from(uint8Array);
        mockUpload.mockImplementationOnce(() => Promise.reject(new Error('Upload failed')));

        const uploadResult = await uploadFile(mockedContainerClient, blobName, buffer,blob.type);

        expect(mockedContainerClient.getBlockBlobClient).toHaveBeenCalledWith(blobName);
        expect(mockUpload).toHaveBeenCalledWith(buffer, {
            blobHTTPHeaders: {
                blobContentType: blob.type,
            },
        });

        expect(uploadResult).toEqual({
            blobName,
            success: false,
            error: 'Upload failed',
        });
    });
});

describe('createContainer', () => {
    beforeEach(() => {
        mockedContainerCreateResponse = {};
        jest.clearAllMocks();
      });
    it('should make and return a container client', async () => {
        const containerName = "test";
        const container = await createContainer(containerName)
        expect(container).toBe(mockedContainerClient);

    }) 
    it('should throw an error from the errorCode', async () => {
        const containerName = "test"
        mockedContainerCreateResponse = { errorCode: '404' };
        await expect(createContainer(containerName)).rejects.toThrowError(`Failed to create container \"${containerName}\":`)
    })

})


