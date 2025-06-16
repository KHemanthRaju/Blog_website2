import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/mongoose";
import Article from "@/lib/models/article";

// GET a single article
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const article = await Article.findById(params.id);
    
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    
    // Check if article is published or user is admin
    const session = await getServerSession();
    const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'author';
    
    if (!article.published && !isAdmin) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

// PUT to update an article
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'author')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await dbConnect();
    
    const data = await req.json();
    const article = await Article.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });
    
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    
    return NextResponse.json(article);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update article" }, { status: 500 });
  }
}

// DELETE an article
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'author')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await dbConnect();
    
    const article = await Article.findByIdAndDelete(params.id);
    
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}