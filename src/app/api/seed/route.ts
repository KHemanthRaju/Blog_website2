import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/user";
import Article from "@/lib/models/article";
import { articles } from "@/lib/data";

export async function GET() {
  try {
    await dbConnect();
    
    // Create admin user
    const existingUser = await User.findOne({ email: "admin@example.com" });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        image: "/images/authors/default.jpg"
      });
    }
    
    // Seed articles
    const existingArticles = await Article.countDocuments();
    
    if (existingArticles === 0) {
      const articlesWithMongoFormat = articles.map(article => ({
        ...article,
        published: true,
      }));
      
      await Article.insertMany(articlesWithMongoFormat);
    }
    
    return NextResponse.json({
      message: "Database seeded successfully",
      adminEmail: "admin@example.com",
      adminPassword: "password123"
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}