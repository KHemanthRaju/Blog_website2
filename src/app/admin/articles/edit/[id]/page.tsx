"use client";

import { useState, useEffect } from "react";
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

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState("");
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${params.id}`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch article");
        }
        
        const article = await res.json();
        setCoverImage(article.coverImage);
        
        reset({
          title: article.title,
          description: article.description,
          content: article.content,
          coverImage: article.coverImage,
          published: article.published,
        });
      } catch (error) {
        console.error("Error fetching article:", error);
        setError("Failed to load article");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [params.id, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/articles/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          coverImage: coverImage, // Use the state value
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update article");
      }

      router.push("/admin/articles");
    } catch (error) {
      console.error("Error updating article:", error);
      setError("Failed to update article");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading article...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded">
        {error}
        <button 
          onClick={() => router.back()}
          className="ml-4 underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Article</h1>
      
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
            Published
          </label>
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
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