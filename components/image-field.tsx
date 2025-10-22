"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface ImageFieldProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  value?: string | File;
  onChange: (name: string, value: string | File | null) => void;
  error?: string;
}

export function ImageField({
  name,
  label,
  required = false,
  placeholder,
  value,
  onChange,
  error,
}: ImageFieldProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (
      file &&
      (file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg")
    ) {
      onChange(name, file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file (PNG, JPEG, or JPG)");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(name, url);
    if (url) {
      setImagePreview(url);
    }
  };

  const handleRemove = () => {
    onChange(name, null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onChange(name, data.url);
        setImagePreview(data.url);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {/* Image Preview */}
      {imagePreview && (
        <div className="relative inline-block">
          <Image
            src={imagePreview}
            alt="Preview"
            width={128}
            height={128}
            className="w-32 h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Upload Options */}
      <div className="space-y-3">
        {/* File Upload */}
        <div>
          <Label htmlFor={`${name}-file`} className="text-sm font-medium">
            Upload Image File
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id={`${name}-file`}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileInputChange}
              ref={fileInputRef}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-1" />
              Choose File
            </Button>
          </div>
        </div>

        {/* URL Input */}
        <div>
          <Label htmlFor={`${name}-url`} className="text-sm font-medium">
            Or Enter Image URL
          </Label>
          <Input
            id={`${name}-url`}
            type="url"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder || "Enter image URL"}
            className={error ? "border-red-500" : ""}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <p className="text-xs text-gray-500">
        Supported formats: PNG, JPEG, JPG. Maximum size: 5MB
      </p>
    </div>
  );
}
