"use client";
import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../theming/components/shadcn/Form";
import { CloudUpload, Paperclip } from "lucide-react";
import * as z from "zod";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "../../theming/components/shadcn/FileUpload";
import { formSchema } from "../PropertyForm";
import { UseFormReturn } from "react-hook-form";
import { FormHeading } from "./FormHeading";

type FormSchemaType = z.infer<typeof formSchema>;

export default function PropertyImages({
  form,
}: {
  form: UseFormReturn<FormSchemaType>;
}) {
  const [files, setFiles] = useState<File[] | null>(null);

  // Updates form when files states changes i.e. submitting file
  useEffect(() => {
    if (files) {
      form.setValue("images", files);
    }
  }, [files]);

  const dropZoneConfig = {
    maxFiles: 20,
    maxSize: 1024 * 1024 * 10,
    multiple: true,
  };

  return (
    <div className="border border-[#E4E4E7] w-full p-7 rounded-md">
      <FormHeading
        title="Property Images"
        subtitle="Upload high-quality images of the property"
      />
      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FileUploader
                value={files}
                onValueChange={setFiles}
                dropzoneOptions={dropZoneConfig}
                className="relative bg-background rounded-lg p-2"
              >
                <FileInput
                  id="fileInput"
                  className="outline-dashed outline-1 outline-[#E4E4E7]"
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
                <FileUploaderContent>
                  {files &&
                    files.length > 0 &&
                    files.map((file, i) => (
                      <FileUploaderItem key={i} index={i}>
                        <Paperclip className="h-4 w-4 stroke-current" />
                        <span>{file.name}</span>
                      </FileUploaderItem>
                    ))}
                </FileUploaderContent>
              </FileUploader>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
