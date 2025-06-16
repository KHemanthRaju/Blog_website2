"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface Article {
  _id: string;
  title: string;
  description: string;
  date: string;
  published: boolean;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articles?published=all");
        const data = await res.json();
        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((article) => {
    if (filter === "all") return true;
    if (filter === "published") return article.published;
    if (filter === "draft") return !article.published;
    return true;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setArticles(articles.filter((article) => article._id !== id));
      } else {
        alert("Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("An error occurred while deleting the article");
    }
  };

  if (loading) {
    return <div>Loading articles...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Link 
          href="/admin/articles/new" 
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
        >
          New Article
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${
              filter === "all" ? "bg-primary text-primary-foreground" : "bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("published")}
            className={`px-4 py-2 rounded ${
              filter === "published" ? "bg-primary text-primary-foreground" : "bg-gray-100"
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={`px-4 py-2 rounded ${
              filter === "draft" ? "bg-primary text-primary-foreground" : "bg-gray-100"
            }`}
          >
            Drafts
          </button>
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <Card key={article._id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{article.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {new Date(article.date).toLocaleDateString()} · 
                    {article.published ? (
                      <span className="text-green-600 ml-2">Published</span>
                    ) : (
                      <span className="text-amber-600 ml-2">Draft</span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/articles/edit/${article._id}`}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(article._id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}