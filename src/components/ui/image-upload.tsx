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

    // Check file size (limit to 800KB)
    if (file.size > 800 * 1024) {
      setError("File size exceeds 800KB limit");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Create data URL directly in the browser
      const reader = new FileReader();
      
      const dataUrlPromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
      
      // Get data URL
      const dataUrl = await dataUrlPromise;
      
      // Use the data URL directly
      console.log("Image converted to data URL");
      onChange(dataUrl);
      setPreviewUrl(dataUrl);
      
    } catch (err: any) {
      setError(err.message || "Error processing image. Please try again.");
      console.error("Image processing error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  // Function to render a fallback image if the main image fails to load
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image failed to load:", previewUrl);
    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
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
          {isUploading ? "Processing..." : "Upload Image"}
        </Button>
        <input
          id="image-upload"
          type="file"
          accept="image/jpeg,image/png,image/svg+xml"
          className="hidden"
          onChange={handleUpload}
          disabled={isUploading}
        />
        {value && value.length > 30 && (
          <span className="text-sm text-muted-foreground">
            Image selected
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
              onError={handleImageError}
            />
          </div>
        </div>
      )}
    </div>
  );
}