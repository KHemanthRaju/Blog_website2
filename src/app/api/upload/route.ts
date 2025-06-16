import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Upload to Cloudinary using stream
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "blog" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      // Create a readable stream from buffer and pipe to uploadStream
      const { Readable } = require("stream");
      Readable.from(buffer).pipe(uploadStream);
    });
    
    // Return the Cloudinary URL
    return NextResponse.json({ 
      message: "File uploaded successfully",
      url: (result as any).secure_url
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Error uploading file" }, { status: 500 });
  }
}