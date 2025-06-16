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
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);

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

    // Create local preview
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", file.name, file.type, file.size);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload response error:", response.status, errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || `Server error: ${response.status}`);
        } catch (parseError) {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const responseText = await response.text();
      console.log("Upload response:", responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response:", responseText);
        throw new Error("Invalid response from server");
      }
      
      if (!data.url) {
        throw new Error("No URL returned from server");
      }

      console.log("Upload successful, URL:", data.url);
      onChange(data.url);
      setPreviewUrl(data.url);
    } catch (err: any) {
      setError(err.message || "Error uploading image. Please try again.");
      console.error("Upload error:", err);
      // Revert to original value if there was one
      setPreviewUrl(value || null);
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

      {previewUrl && (
        <div className="relative h-48 w-full overflow-hidden rounded border">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <img
              src={previewUrl}
              alt="Uploaded image"
              className="h-full w-full object-contain"
              onError={(e) => {
                console.error("Image failed to load:", previewUrl);
                setError("Failed to load image preview");
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}