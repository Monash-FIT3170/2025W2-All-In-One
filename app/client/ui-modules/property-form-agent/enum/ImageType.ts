/**
 * Enum for image types in the image order system
 */
export enum ImageType {
  EXISTING = 'existing',
  NEW = 'new'
}

/**
 * Interface for image order items used in property image management
 * Tracks the type and index of images in the display order
 */
export interface ImageOrderItem {
  type: ImageType;
  index: number;
}
