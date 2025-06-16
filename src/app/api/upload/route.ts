import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { writeFile } from "fs/promises";
import path from "path";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

export async function POST(req: NextRequest) {
  try {
    console.log("Upload API called");
    
    // Check if Cloudinary credentials are properly configured
    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
      console.error("Cloudinary credentials missing");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    
    console.log("File received:", file.name, file.type, file.size);
    
    try {
      // First save the file locally as a fallback
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
      const uploadDir = path.join(process.cwd(), "public/images/uploads");
      const filepath = path.join(uploadDir, filename);
      
      // Save file to public directory
      await writeFile(filepath, buffer);
      console.log(`File saved locally at: ${filepath}`);
      
      // Local URL as fallback
      const localUrl = `/images/uploads/${filename}`;
      
      try {
        // Try to upload to Cloudinary
        const base64 = buffer.toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;
        
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            dataURI,
            {
              folder: "blog",
              resource_type: "auto",
              timeout: 60000 // Increase timeout to 60 seconds
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                console.log("Cloudinary upload success:", result?.secure_url);
                resolve(result);
              }
            }
          );
        });
        
        // Return the Cloudinary URL if successful
        return NextResponse.json({ 
          message: "File uploaded successfully to Cloudinary",
          url: (uploadResult as any).secure_url
        });
      } catch (cloudinaryError) {
        console.error("Cloudinary upload failed, using local file:", cloudinaryError);
        
        // Return the local URL as fallback
        return NextResponse.json({ 
          message: "File uploaded locally (Cloudinary upload failed)",
          url: localUrl
        });
      }
    } catch (fileError: any) {
      console.error("File processing error:", fileError);
      return NextResponse.json({ 
        error: "Failed to process file" 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: error.message || "Error uploading file" 
    }, { status: 500 });
  }
}