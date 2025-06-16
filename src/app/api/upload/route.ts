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
    console.log("Upload API called");
    console.log("Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY?.substring(0, 5) + "..." // Log only first 5 chars for security
    });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    
    console.log("File received:", file.name, file.type, file.size);
    
    // Convert file to base64 for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;
    
    // Upload to Cloudinary using direct upload
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          dataURI,
          {
            folder: "blog",
            resource_type: "auto"
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
      
      // Return the Cloudinary URL
      return NextResponse.json({ 
        message: "File uploaded successfully",
        url: (uploadResult as any).secure_url
      });
    } catch (cloudinaryError) {
      console.error("Cloudinary upload failed:", cloudinaryError);
      return NextResponse.json({ 
        error: "Failed to upload to Cloudinary" 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: error.message || "Error uploading file" 
    }, { status: 500 });
  }
}