"use client";

import { useState } from "react";
import { Button } from "./button";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
      setError("Only JPEG, PNG, and SVG formats are allowed");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "Error uploading image. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("image-upload")?.click()}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Image"}
        </Button>
        <input
          id="image-upload"
          type="file"
          accept="image/jpeg,image/png,image/svg+xml"
          className="hidden"
          onChange={handleUpload}
          disabled={isUploading}
        />
        {value && (
          <span className="text-sm text-muted-foreground truncate max-w-[200px]">
            {value.includes("/") ? value.split("/").pop() : value}
          </span>
        )}
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      {value && (
        <div className="relative h-48 w-full overflow-hidden rounded border">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <img
              src={value}
              alt="Uploaded image"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}