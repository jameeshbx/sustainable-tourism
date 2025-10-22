"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImageUrl?: string;
  label?: string;
}

export function ImageUpload({
  onImageUpload,
  currentImageUrl,
  label = "Destination Image",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState<string>(currentImageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const { imageUrl } = await response.json();
      setPreviewUrl(imageUrl);
      onImageUpload(imageUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setUrlInput("");
    onImageUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setPreviewUrl(urlInput.trim());
      onImageUpload(urlInput.trim());
    }
  };

  const handleUrlChange = (value: string) => {
    setUrlInput(value);
    if (value.trim()) {
      setPreviewUrl(value.trim());
      onImageUpload(value.trim());
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="image">{label}</Label>

      {/* Upload Method Selection */}
      <div className="space-y-2">
        <Label htmlFor="upload-method">Upload Method</Label>
        <Select
          value={uploadMethod}
          onValueChange={(value: "file" | "url") => setUploadMethod(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select upload method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="file">Upload File</SelectItem>
            <SelectItem value="url">Enter URL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {previewUrl && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Image
                src={previewUrl}
                alt="Preview"
                width={400}
                height={192}
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {uploadMethod === "file" ? (
        <div className="flex items-center space-x-4">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Choose Image"}
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="image-url">Image URL</Label>
          <div className="flex space-x-2">
            <Input
              id="image-url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
            >
              Use URL
            </Button>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500">
        {uploadMethod === "file"
          ? "Supported formats: JPG, PNG, GIF. Max size: 5MB"
          : "Enter a valid image URL (JPG, PNG, GIF, WebP)"}
      </p>
    </div>
  );
}
