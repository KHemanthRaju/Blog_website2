import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export const maxDuration = 60; // 60 seconds timeout

export async function POST(req: NextRequest) {
  try {
    console.log("Upload API called");
    
    const formData = await req.formData();
    const file = formData.get("file");
    
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No valid file uploaded" }, { status: 400 });
    }
    
    console.log("File received:", file.name, file.type, file.size);
    
    // Create a unique filename
    const timestamp = Date.now();
    const safeFilename = file.name?.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '') || 'image.jpg';
    const filename = `${timestamp}-${safeFilename}`;
    
    try {
      // Get file data
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Define paths
      const publicDir = path.join(process.cwd(), "public");
      const uploadsDir = path.join(publicDir, "images", "uploads");
      
      // Create directories if they don't exist
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Save file
      const filepath = path.join(uploadsDir, filename);
      fs.writeFileSync(filepath, buffer);
      
      console.log(`File saved at: ${filepath}`);
      
      // Return the URL
      return NextResponse.json({ 
        success: true,
        url: `/images/uploads/${filename}`
      });
    } catch (error: any) {
      console.error("File system error:", error);
      return NextResponse.json({ 
        error: "Server file system error" 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: "Server error processing upload" 
    }, { status: 500 });
  }
}