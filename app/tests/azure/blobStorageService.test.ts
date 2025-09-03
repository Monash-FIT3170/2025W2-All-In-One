import { expect, jest, beforeAll, describe, it } from "@jest/globals";
import type { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import type { UploadResult } from "/app/shared/azure/blob-models";
import { blobToUint8Array } from "/app/client/library-modules/apis/azure/blob-api";
import { testBlob } from "./testBlob";
const mockUpload = jest
  .fn()
  .mockImplementation(() => Promise.resolve({ status: 200 }));
const mockedBlockBlobClient = {
  uploadData: mockUpload,
  url: "https://mockstorage.blob.core.windows.net/container/test.txt",
};

const mockedContainerClient = {
  getBlockBlobClient: jest.fn(() => mockedBlockBlobClient),
} as unknown as ContainerClient;
let mockedContainerCreateResponse: { errorCode?: string } = {};

jest.mock("meteor/meteor", () => ({
  Meteor: {
    settings: {
      private: {
        AZURE_CONNECTION_STRING: "test",
      },
    },
  },
}));
jest.mock("@azure/storage-blob", () => ({
  BlobServiceClient: {
    fromConnectionString: jest.fn(() => ({
      getContainerClient: jest.fn(() => mockedContainerClient),
      createContainer: jest.fn().mockImplementation(() =>
        Promise.resolve({
          containerClient: mockedContainerClient,
          containerCreateResponse: mockedContainerCreateResponse,
        })
      ),
    })),
  } as unknown as BlobServiceClient,
  StorageRetryPolicyType: {
    EXPONENTIAL: "EXPONENTIAL",
  },
}));

// Defer importing the SUT until after mocks are in place
let createContainer: (name: string) => Promise<ContainerClient>;
let uploadFile: (
  container: ContainerClient,
  blobName: string,
  buffer: Buffer,
  contentType: string
) => Promise<UploadResult>;
beforeAll(async () => {
  const mod = await import("../../server/methods/azure/blob-storage-service");
  createContainer = mod.createContainer as typeof createContainer;
  uploadFile = mod.uploadFile as typeof uploadFile;
});

describe("uploadFile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should upload the file and return success result", async () => {
    const blobName = "test";
    const blob = testBlob;
    const uint8Array = await blobToUint8Array(blob);
    const buffer: Buffer = Buffer.from(uint8Array);
    const uploadResult = await uploadFile(
      mockedContainerClient,
      blobName,
      buffer,
      blob.type
    );

    expect(mockedContainerClient.getBlockBlobClient).toHaveBeenCalledWith(
      blobName
    );
    expect(mockUpload).toHaveBeenCalledWith(buffer, {
      blobHTTPHeaders: {
        blobContentType: blob.type,
      },
    });

    expect(uploadResult).toEqual({
      blobName,
      response: { status: 200 },
      success: true,
      url: "https://mockstorage.blob.core.windows.net/container/test.txt",
    });
  });
  it("should handle upload failure and return failure result", async () => {
    const blobName = "test";
    const blob = testBlob;
    const uint8Array = await blobToUint8Array(blob);
    const buffer: Buffer = Buffer.from(uint8Array);
    mockUpload.mockImplementationOnce(() =>
      Promise.reject(new Error("Upload failed"))
    );

    const uploadResult = await uploadFile(
      mockedContainerClient,
      blobName,
      buffer,
      blob.type
    );

    expect(mockedContainerClient.getBlockBlobClient).toHaveBeenCalledWith(
      blobName
    );
    expect(mockUpload).toHaveBeenCalledWith(buffer, {
      blobHTTPHeaders: {
        blobContentType: blob.type,
      },
    });

    expect(uploadResult).toEqual({
      blobName,
      success: false,
      error: "Upload failed",
    });
  });
});

describe("createContainer", () => {
  beforeEach(() => {
    mockedContainerCreateResponse = {};
    jest.clearAllMocks();
  });
  it("should make and return a container client", async () => {
    const containerName = "test";
    const container = await createContainer(containerName);
    expect(container).toBe(mockedContainerClient);
  });
  it("should throw an error from the errorCode", async () => {
    const containerName = "test";
    mockedContainerCreateResponse = { errorCode: "404" };
    await expect(createContainer(containerName)).rejects.toThrow(
      /Failed to create container "test": 404/
    );
  });
});
