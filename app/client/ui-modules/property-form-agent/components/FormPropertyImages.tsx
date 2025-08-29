"use client";
import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../theming-shadcn/Form";
import { CloudUpload } from "lucide-react";
import {
  FileUploader,
  FileInput,
} from "../../theming-shadcn/FileUpload";
import { FormSchemaType } from "./FormSchema";
import { UseFormReturn } from "react-hook-form";
import { FormHeading } from "./FormHeading";
import ImagePreviewGrid from "./ImagePreviewGrid";

export interface FormPropertyImagesRef {
  addExistingImages: (urls: string[]) => void;
  getCombinedImages: () => { existingImages: string[]; newImages: File[]; imageOrder: { type: 'existing' | 'new'; index: number }[] };
}

const FormPropertyImages = forwardRef<FormPropertyImagesRef, { form: UseFormReturn<FormSchemaType> }>(({ form }, ref) => {
  const [existingImages, setExistingImages] = useState<string[]>([]); // blob urls
  const [newImages, setNewImages] = useState<File[]>(() => {
    return form.getValues("images") || [];
  }); // new images uploaded
  
  // Order tracking: array of objects indicating the type and index in respective arrays
  const [imageOrder, setImageOrder] = useState<Array<{type: 'existing' | 'new', index: number}>>(() => {
    const formImages = form.getValues("images") || [];
    // Since we're starting with only new files from form, create order for them
    return formImages.map((_, index) => ({type: 'new' as const, index}));
  });
  
  // Array to hold preview URLs for display
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedOver, setDraggedOver] = useState<number | null>(null);

  // Generate preview URLs whenever images or order changes
  useEffect(() => {
    const newPreviewUrls: string[] = [];
    
    imageOrder.forEach(orderItem => {
      if (orderItem.type === 'existing') {
        const url = existingImages[orderItem.index];
        if (url) newPreviewUrls.push(url);
      } else {
        const file = newImages[orderItem.index];
        if (file) newPreviewUrls.push(URL.createObjectURL(file));
      }
    });
    
    // Clean up old blob URLs that are no longer needed
    previewUrls.forEach(url => {
      if (!newPreviewUrls.includes(url) && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    
    setPreviewUrls(newPreviewUrls);
  }, [existingImages, newImages, imageOrder]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  // Updates form when images change - handle both existing and new images for validation
  useEffect(() => {
    // For validation purposes, we need at least one image (existing OR new)
    const totalImageCount = existingImages.length + newImages.length;
    
    if (totalImageCount > 0) {
      // If we have any images (existing or new), satisfy the form validation
      // We always set newImages to the form as it expects File[], but clear validation errors
      // if we have existing images even when newImages is empty
      form.setValue("images", newImages, { shouldValidate: false });
      form.clearErrors("images");
      console.log("FORM UPDATE: Total images:", totalImageCount, "New files:", newImages.length, "Existing:", existingImages.length);
    } else {
      // No images at all, let validation show the error
      form.setValue("images", [], { shouldValidate: true });
      console.log("FORM UPDATE: No images, validation will show error");
    }
  }, [newImages, existingImages, form]);

  const dropZoneConfig = {
    maxFiles: 20,
    maxSize: 1024 * 1024 * 10,
    multiple: true,
  };

  // Helper function to add existing images (useful for editing drafts)
  const addExistingImages = (urls: string[]) => {
    const currentExistingLength = existingImages.length;
    setExistingImages(prev => [...prev, ...urls]);
    
    // Add to order
    const newOrderItems = urls.map((_, index) => ({
      type: 'existing' as const,
      index: currentExistingLength + index
    }));
    setImageOrder(prev => [...prev, ...newOrderItems]);
  };

  // Expose functions through ref
  useImperativeHandle(ref, () => ({
    addExistingImages,
    getCombinedImages: () => ({
      existingImages,
      newImages,
      imageOrder
    })
  }));

  // Create combined array for ImagePreviewGrid based on current order
  const combinedImages = imageOrder.map(orderItem => {
    if (orderItem.type === 'existing') {
      return existingImages[orderItem.index];
    } else {
      return newImages[orderItem.index];
    }
  }).filter(Boolean); // Remove any undefined items

  // Handle file removal
  const removeFile = (indexToRemove: number) => {
    const orderItem = imageOrder[indexToRemove];
    if (!orderItem) return;
    
    if (orderItem.type === 'existing') {
      // Remove from existing images
      const newExistingImages = existingImages.filter((_, idx) => idx !== orderItem.index);
      setExistingImages(newExistingImages);
      
      // Update order - adjust indices for remaining existing images
      const newOrder = imageOrder
        .filter((_, idx) => idx !== indexToRemove)
        .map(item => {
          if (item.type === 'existing' && item.index > orderItem.index) {
            return { ...item, index: item.index - 1 };
          }
          return item;
        });
      setImageOrder(newOrder);
    } else {
      // Remove from new images
      const newNewImages = newImages.filter((_, idx) => idx !== orderItem.index);
      setNewImages(newNewImages);
      
      // Update order - adjust indices for remaining new images
      const newOrder = imageOrder
        .filter((_, idx) => idx !== indexToRemove)
        .map(item => {
          if (item.type === 'new' && item.index > orderItem.index) {
            return { ...item, index: item.index - 1 };
          }
          return item;
        });
      setImageOrder(newOrder);
    }
    
    console.log("DELETED: Image deleted");
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDraggedOver(index);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || imageOrder.length === 0) return;

    const newOrder = [...imageOrder];
    const draggedItem = newOrder[draggedIndex];
    
    // Remove the dragged item from its original position
    newOrder.splice(draggedIndex, 1);
    
    // Insert at new position - no adjustment needed for end placement
    newOrder.splice(dropIndex, 0, draggedItem);
    
    setImageOrder(newOrder);
    console.log("REORDERED: Images reordered");
    setDraggedIndex(null);
    setDraggedOver(null);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDraggedOver(null);
  };

  // Handle new file uploads
  const handleNewFiles = (allFiles: File[] | null) => {
    if (!allFiles || allFiles.length === 0) {
      console.log("No files provided");
      return;
    }
    
    // Filter out files that are already in our new images list
    const existingFileNames = newImages.map(file => file.name);
    const trulyNewFiles = allFiles.filter(file => !existingFileNames.includes(file.name));
    
    if (trulyNewFiles.length === 0) {
      console.log("All files already exist in current selection");
      return;
    }
    
    // Update newImages state
    const currentNewImagesLength = newImages.length;
    setNewImages(prev => [...prev, ...trulyNewFiles]);
    
    // Add to order at the end
    const newOrderItems = trulyNewFiles.map((_, index) => ({
      type: 'new' as const,
      index: currentNewImagesLength + index
    }));
    setImageOrder(prev => [...prev, ...newOrderItems]);
    
    console.log("ADDED: New files added:", trulyNewFiles);
  };

  return (
    <div className="border border-gray-200 w-full p-7 rounded-md mb-3">
      <FormHeading
        title="Property Images"
        subtitle="Upload high-quality images of the property. Drag to reorder."
      />
      <FormField
        control={form.control}
        name="images"
        render={({ fieldState }) => {
          // Custom validation message that considers both existing and new images
          const totalImageCount = existingImages.length + newImages.length;
          const hasValidationError = fieldState.error && totalImageCount === 0;
          
          return (
            <FormItem>
              <FormControl>
                <FileUploader
                  value={newImages}
                  onValueChange={handleNewFiles}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput
                    id="fileInput"
                    className="outline-dashed outline-1 outline-(--divider-color)"
                  >
                    <div className="flex items-center justify-center flex-col p-8 w-full ">
                      <CloudUpload className="text-gray-500 w-10 h-10" />
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>
                        &nbsp;or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Upload up to 20 images (JPEG, PNG, WebP) up to 10MB each
                      </p>
                    </div>
                  </FileInput>

                  {/* Image Previews with Drag and Drop */}
                  {combinedImages && combinedImages.length > 0 && (
                    <ImagePreviewGrid
                      imageUrls={previewUrls}
                      imageItems={combinedImages}
                      draggedIndex={draggedIndex}
                      draggedOver={draggedOver}
                      onRemoveFile={removeFile}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onDragEnd={handleDragEnd}
                      onDragLeave={() => setDraggedOver(null)}
                    />
                  )}
                </FileUploader>
              </FormControl>
              
              {/* Custom validation message */}
              {hasValidationError && (
                <p className="text-sm font-medium text-destructive">
                  At least one image is required
                </p>
              )}
            </FormItem>
          );
        }}
      />
    </div>
  );
});

FormPropertyImages.displayName = 'FormPropertyImages';
export default FormPropertyImages;