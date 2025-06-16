import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    console.log("Upload API called");
    
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    
    console.log("File received:", file.name, file.type, file.size);
    
    try {
      // First save the file locally
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create a unique filename
      const timestamp = Date.now();
      const safeFilename = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
      const filename = `${timestamp}-${safeFilename}`;
      const uploadDir = path.join(process.cwd(), "public/images/uploads");
      const filepath = path.join(uploadDir, filename);
      
      // Ensure upload directory exists
      if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      
      // Save file to public directory
      await writeFile(filepath, buffer);
      console.log(`File saved locally at: ${filepath}`);
      
      // Local URL
      const localUrl = `/images/uploads/${filename}`;
      
      // Skip Cloudinary for now and use local file directly
      return NextResponse.json({ 
        message: "File uploaded successfully",
        url: localUrl
      });
      
    } catch (fileError: any) {
      console.error("File processing error:", fileError);
      return NextResponse.json({ 
        error: "Failed to process file: " + (fileError.message || "Unknown error")
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: error.message || "Error uploading file" 
    }, { status: 500 });
  }
}