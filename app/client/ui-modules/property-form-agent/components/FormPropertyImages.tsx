"use client";
import React, { useState, useEffect } from "react";
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

export default function FormPropertyImages({
  form,
}: {
  form: UseFormReturn<FormSchemaType>;
}) {
  const [files, setFiles] = useState<(File | string)[] | null>(null); // Contains files (new images) and URLs (existing images)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedOver, setDraggedOver] = useState<number | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Initialize with existing images from form
  useEffect(() => {
    const existingImages = form.getValues("images");
    if (existingImages && existingImages.length > 0) {
      setFiles(existingImages);
      
      // Create preview URLs - for existing URLs, use them directly; for files, create object URLs
      const newPreviewUrls = existingImages.map(item => 
        typeof item === 'string' ? item : URL.createObjectURL(item)
      );
      setPreviewUrls(newPreviewUrls);
    }
  }, []);

  // Updates form when files state changes
  useEffect(() => {
    if (files) {
      form.setValue("images", files, { shouldValidate: true });
      
      // Create preview URLs for files, keeping existing URLs as is
      const newPreviewUrls = files.map(item => {
        if (typeof item === 'string') {
          return item; // Existing URL
        } else {
          return URL.createObjectURL(item); // New file
        }
      });
      
      // Clean up old URLs that are no longer needed
      previewUrls.forEach(url => {
        if (!newPreviewUrls.includes(url)) {
          URL.revokeObjectURL(url);
        }
      });
      
      setPreviewUrls(newPreviewUrls);
    } else {
      // When files is null (all images deleted), set form to empty array
      form.setValue("images", [], { shouldValidate: true });
      // Clean up URLs when files are cleared
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      setPreviewUrls([]);
    }
  }, [files]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  const dropZoneConfig = {
    maxFiles: 20,
    maxSize: 1024 * 1024 * 10,
    multiple: true,
  };

  // Handle file removal
  const removeFile = (indexToRemove: number) => {
    if (files) {
      const newFiles = files.filter((_, index) => index !== indexToRemove);
      setFiles(newFiles.length > 0 ? newFiles : null);
      console.log("DELETED: Photo deleted. Updated files:", newFiles.length > 0 ? newFiles : null);
    }
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
    
    if (draggedIndex === null || !files) return;

    const newFiles = [...files];
    const draggedFile = newFiles[draggedIndex];
    
    // Remove the dragged item
    newFiles.splice(draggedIndex, 1);
    
    // Insert at new position
    newFiles.splice(dropIndex, 0, draggedFile);
    
    setFiles(newFiles);
    console.log("REORDERED: Photos reordered. Updated files:", newFiles);
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
    // If no files, preserve only URLs (existing images)
    if (!allFiles || allFiles.length === 0) {
      if (files) {
        const urlsOnly = files.filter(f => typeof f === 'string');
        const result = urlsOnly.length > 0 ? urlsOnly : null;
        setFiles(result);
        console.log("CLEARED: All new files cleared. Updated files:", result);
      } else {
        setFiles(null);
        console.log("CLEARED: No files to clear. Updated files:", null);
      }
      return;
    }

    // Preserve URLs, replace Files with new selection
    const urlsOnly = files ? files.filter(f => typeof f === 'string') : [];
    const result = [...urlsOnly, ...allFiles];
    setFiles(result);
    console.log("ADDED: New files added. Updated files:", result);
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
        render={() => (
          <FormItem>
            <FormControl>
              <FileUploader
                value={files?.filter(f => f instanceof File) as File[] || null}
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
                {files && files.length > 0 && (
                  <ImagePreviewGrid
                    files={files}
                    previewUrls={previewUrls}
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
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}