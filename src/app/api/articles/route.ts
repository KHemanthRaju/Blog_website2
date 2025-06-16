import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Article from "@/lib/models/article";

// GET all articles (published for public, all for admin)
export async function GET(req: NextRequest) {
  try {
    // Temporarily disable auth check for testing
    const { searchParams } = new URL(req.url);
    const published = searchParams.get('published');
    
    await dbConnect();
    
    let query = {};
    
    if (published === 'true') {
      query = { published: true };
    } else if (published === 'false') {
      query = { published: false };
    }
    
    const articles = await Article.find(query).sort({ date: -1 });
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

// POST a new article
export async function POST(req: NextRequest) {
  try {
    // Temporarily disable auth check for testing
    await dbConnect();
    
    const data = await req.json();
    console.log("Creating article with data:", data);
    
    // Create the article
    const article = await Article.create({
      title: data.title,
      description: data.description,
      content: data.content,
      coverImage: data.coverImage,
      published: data.published || false,
      author: data.author || {
        name: "Admin",
        image: "/images/authors/default.jpg"
      },
      date: data.date || new Date().toISOString()
    });
    
    console.log("Article created:", article);
    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    console.error("Error creating article:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to create article",
      details: error.toString()
    }, { status: 500 });
  }
}