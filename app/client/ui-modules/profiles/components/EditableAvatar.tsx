import React from "react";
import { useRef } from "react";
import {
  selectIsEditing,
  selectProfileData,
  setEditing,
  updateField,
} from "../state/profile-slice";
import { useAppDispatch, useAppSelector } from "/app/client/store";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface EditableAvatarProps {
  imageUrl?: string;
  editing: boolean;
  onImageChange?: (file: File) => void;
}

export function EditableAvatar({
  imageUrl,
  editing,
  onImageChange,
}: EditableAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null); // acts as invisible file input selecvt

  const handleClick = () => {
    if (editing && fileInputRef.current) {
      fileInputRef.current.click(); // clicks hidden input if on editing mode
    }
  };

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // grabs the first file for upload

    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];

    // can also check dimensions
    if (!validTypes.includes(file.type)) {
      return;
    }

    if (file && onImageChange) {
      onImageChange(file);
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <div
        className={`relative ${editing ? "cursor-pointer group" : ""}`}
        onClick={handleClick}
      >
        <Avatar>
          <AvatarImage
            src={imageUrl}
            alt="Profile Picture"
            className="w-24 h-24 object-cover rounded-full"
          />
          <AvatarFallback>
            <img
              src="/images/test-image.png"
              alt="Fallback Image"
              className="w-24 h-24 object-cover rounded-full"
            />
          </AvatarFallback>
        </Avatar>

        {editing && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition">
            <span className="text-white text-sm">Edit</span>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleUpdate}
          className="hidden"
        />
      </div>
    </div>
  );
}
