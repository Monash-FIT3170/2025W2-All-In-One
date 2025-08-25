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
  const [currentImages, setCurrentImages] = useState<(File | string)[] | null>(form.getValues("images")); // Contains files (new images) and URLs (existing images)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedOver, setDraggedOver] = useState<number | null>(null);

  // Updates form when files state changes
  useEffect(() => {
    form.setValue("images", currentImages || [], { shouldValidate: true });
    console.log("FORM UPDATE: Form images updated:", currentImages);
  }, [currentImages]);

  const dropZoneConfig = {
    maxFiles: 20,
    maxSize: 1024 * 1024 * 10,
    multiple: true,
  };

  // Handle file removal
  const removeFile = (indexToRemove: number) => {
    if (currentImages) {
      const newFiles = currentImages.filter((_, index) => index !== indexToRemove);
      setCurrentImages(newFiles.length > 0 ? newFiles : null);
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
    
    if (draggedIndex === null || !currentImages) return;

    const newFiles = [...currentImages];
    const draggedFile = newFiles[draggedIndex];
    
    // Remove the dragged item
    newFiles.splice(draggedIndex, 1);
    
    // Insert at new position
    newFiles.splice(dropIndex, 0, draggedFile);
    
    setCurrentImages(newFiles);
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
    if (!allFiles) {
      console.log("Unexpected null files");
      return;
    }
    
    // Check if any of the allFiles already exist in our current files
    const currentFiles = currentImages || [];
    const existingFileNames = currentFiles
      .filter(f => f instanceof File)
      .map(f => (f as File).name);
    
    // Separate truly new files from re-uploaded existing files
    const newFiles = allFiles.filter(file => !existingFileNames.includes(file.name));
    
    if (newFiles.length === 0) {
      // No new files, this might be a re-upload of existing files
      console.log("No new files detected, keeping current arrangement");
      return;
    }
    
    // Keep existing files (URLs and File objects) and add only additional new files
    const result = [...currentFiles, ...newFiles];
    setCurrentImages(result);
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
                value={currentImages?.filter(f => f instanceof File) as File[] || null}
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
                {currentImages && currentImages.length > 0 && (
                  <ImagePreviewGrid
                    files={currentImages}
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