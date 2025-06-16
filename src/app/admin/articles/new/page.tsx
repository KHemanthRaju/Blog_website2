"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ImageUpload } from "@/components/ui/image-upload";

interface FormData {
  title: string;
  description: string;
  content: string;
  coverImage: string;
  published: boolean;
}

// Default placeholder that exists in the public folder
const DEFAULT_PLACEHOLDER = "https://via.placeholder.com/800x400?text=Select+Cover+Image";

export default function NewArticlePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState(DEFAULT_PLACEHOLDER);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: "",
      content: "",
      coverImage: DEFAULT_PLACEHOLDER,
      published: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    
    // Validate cover image
    if (coverImage === DEFAULT_PLACEHOLDER) {
      setError("Please upload a cover image");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const articleData = {
        ...data,
        coverImage: coverImage,
        author: {
          name: "Admin",
          image: "https://via.placeholder.com/100x100?text=Admin",
        },
        date: new Date().toISOString(),
      };
      
      console.log("Submitting article data:", articleData);
      
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      const responseData = await response.json();
      
      if (response.ok) {
        router.push("/admin/articles");
      } else {
        console.error("API error response:", responseData);
        setError(`Failed to create article: ${responseData.error || responseData.details || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("Error creating article:", error);
      setError(error.message || "An error occurred while creating the article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Create New Article</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full p-2 border rounded"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="text-red-500 text-xs">{errors.title.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full p-2 border rounded"
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium">
            Content (Markdown supported)
          </label>
          <textarea
            id="content"
            rows={15}
            className="w-full p-2 border rounded font-mono"
            {...register("content", { required: "Content is required" })}
          />
          {errors.content && (
            <p className="text-red-500 text-xs">{errors.content.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Cover Image
          </label>
          <ImageUpload 
            value={coverImage} 
            onChange={setCoverImage} 
          />
          <input
            type="hidden"
            {...register("coverImage")}
            value={coverImage}
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="published"
            type="checkbox"
            className="h-4 w-4 border rounded"
            {...register("published")}
          />
          <label htmlFor="published" className="ml-2 block text-sm">
            Publish immediately
          </label>
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
          >
            {isSubmitting ? "Creating..." : "Create Article"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-100 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}