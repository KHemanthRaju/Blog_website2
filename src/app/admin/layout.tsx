"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  // Don't apply layout to login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }
  
  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <p>You must be logged in to view this page</p>
        <Link href="/admin/login" className="bg-primary text-primary-foreground px-4 py-2 rounded">
          Login
        </Link>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome, {session?.user?.name}</p>
        </div>
        
        <nav className="space-y-1">
          <Link 
            href="/admin" 
            className={`block p-2 rounded ${pathname === "/admin" ? "bg-primary text-primary-foreground" : "hover:bg-gray-200"}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/articles" 
            className={`block p-2 rounded ${pathname.startsWith("/admin/articles") ? "bg-primary text-primary-foreground" : "hover:bg-gray-200"}`}
          >
            Articles
          </Link>
          <Link 
            href="/" 
            className="block p-2 rounded hover:bg-gray-200"
          >
            View Blog
          </Link>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}