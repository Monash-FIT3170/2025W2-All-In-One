"use client";
import React from "react";
import { X } from "lucide-react";

interface ImagePreviewGridProps {
  imageUrls: string[];
  imageItems: (File | string)[];
  draggedIndex: number | null;
  draggedOver: number | null;
  onRemoveFile: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onDragLeave: () => void;
}

export default function ImagePreviewGrid({
  imageUrls,
  imageItems,
  draggedIndex,
  draggedOver,
  onRemoveFile,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onDragLeave,
}: ImagePreviewGridProps) {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-medium">
          {imageItems.length} image{imageItems.length > 1 ? 's' : ''} uploaded
        </p>
        <p className="text-xs text-gray-500">
          Drag images to reorder
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {imageItems.map((item, index) => {
          const isFile = item instanceof File;
          const displayName = isFile ? item.name : `Image ${index + 1}`;
          const displaySize = isFile ? `${Math.round(item.size / 1024)} KB` : 'Existing image';
          
          return (
            <div
              key={isFile ? `${item.name}-${index}` : `url-${index}`}
              className={`relative group border rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-200 cursor-move ${
                draggedIndex === index ? 'opacity-50 scale-95 rotate-2' : ''
              } ${
                draggedOver === index && draggedIndex !== index 
                  ? 'border-blue-500 border-2 scale-105 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              draggable
              onDragStart={(e) => onDragStart(e, index)}
              onDragOver={(e) => onDragOver(e, index)}
              onDrop={(e) => onDrop(e, index)}
              onDragEnd={onDragEnd}
              onDragLeave={onDragLeave}
            >
              {/* Remove Button */}
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 rounded p-1 h-6 w-6 flex items-center justify-center transition-colors"
                  onClick={() => onRemoveFile(index)}
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>

              {/* Image Preview */}
              <div className="aspect-square">
                <img
                  src={imageUrls[index]}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* File Name */}
              <div className="p-2 bg-gray-50">
                <p className="text-xs text-gray-600 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-400">
                  {displaySize}
                </p>
              </div>

              {/* Order indicator */}
              <div className="absolute bottom-2 right-2 bg-blue-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                {index + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
