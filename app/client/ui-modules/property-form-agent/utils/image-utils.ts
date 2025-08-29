/**
 * Enum for image types in the image order system
 */
export enum ImageType {
  EXISTING = 'existing',
  NEW = 'new'
}

/**
 * Interface for image order items
 */
export interface ImageOrderItem {
  type: ImageType;
  index: number;
}

/**
 * Utility functions for handling property image management
 * Supports both existing images (URLs) and new uploads (File objects)
 */

// /**
//  * Separates mixed image array into existing URLs and new files
//  */
// export function separateImagesAndFiles(items: (File | string)[]): {
//   existingUrls: string[];
//   newFiles: File[];
// } {
//   const existingUrls: string[] = [];
//   const newFiles: File[] = [];

//   items.forEach(item => {
//     if (typeof item === 'string') {
//       existingUrls.push(item);
//     } else {
//       newFiles.push(item);
//     }
//   });

//   return { existingUrls, newFiles };
// }

// /**
//  * Creates a mapping from File objects to their uploaded URLs
//  */
// export function createFileToUrlMapping(files: File[], uploadedUrls: string[]): Map<File, string> {
//   const mapping = new Map<File, string>();
  
//   files.forEach((file, index) => {
//     if (uploadedUrls[index]) {
//       mapping.set(file, uploadedUrls[index]);
//     }
//   });

//   return mapping;
// }

// /**
//  * Converts mixed array of Files and URLs to all URLs, using the provided mapping
//  * Preserves the original order
//  */
// export function convertToUrlArray(
//   items: (File | string)[],
//   fileToUrlMap: Map<File, string>
// ): string[] {
//   const results: string[] = [];

//   items.forEach(item => {
//     if (typeof item === 'string') {
//       results.push(item);
//     } else {
//       const url = fileToUrlMap.get(item);
//       if (url) {
//         results.push(url);
//       } else {
//         console.warn('No URL mapping found for file:', item.name);
//       }
//     }
//   });

//   return results;
// }

// /**
//  * Validates if an item is a valid image (File or URL string)
//  */
// export function isValidImageItem(item: unknown): item is File | string {
//   return (
//     typeof item === 'string' ||
//     (item instanceof File && item.type.startsWith('image/'))
//   );
// }

// /**
//  * Checks if an array contains any File objects (indicating new uploads)
//  */
// export function hasNewUploads(items: (File | string)[]): boolean {
//   return items.some(item => item instanceof File);
// }

// /**
//  * Gets display information for an image item
//  */
// export function getImageDisplayInfo(item: File | string, index: number): {
//   displayName: string;
//   displaySize: string;
//   isFile: boolean;
// } {
//   const isFile = item instanceof File;
  
//   return {
//     displayName: isFile ? item.name : `Image ${index + 1}`,
//     displaySize: isFile ? `${Math.round(item.size / 1024)} KB` : 'Existing image',
//     isFile,
//   };
// }
