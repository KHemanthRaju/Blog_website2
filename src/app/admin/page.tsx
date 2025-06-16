"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface Stats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/articles?published=all");
        const articles = await res.json();
        
        setStats({
          totalArticles: articles.length,
          publishedArticles: articles.filter((a: any) => a.published).length,
          draftArticles: articles.filter((a: any) => !a.published).length,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link 
          href="/admin/articles/new" 
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
        >
          New Article
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-2">Total Articles</h2>
          <p className="text-3xl font-bold">{stats.totalArticles}</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-2">Published</h2>
          <p className="text-3xl font-bold">{stats.publishedArticles}</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-2">Drafts</h2>
          <p className="text-3xl font-bold">{stats.draftArticles}</p>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/articles" className="block p-4 border rounded hover:bg-gray-50">
            Manage Articles
          </Link>
          <Link href="/admin/articles/new" className="block p-4 border rounded hover:bg-gray-50">
            Create New Article
          </Link>
        </div>
      </div>
    </div>
  );
}