import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import path from "path";

// Temporarily disable auth check for testing
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
    const uploadsDir = join(process.cwd(), "public", "images", "uploads");
    const filePath = join(uploadsDir, filename);
    
    // Ensure the uploads directory exists
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      console.log("Directory already exists or cannot be created");
    }
    
    // Write the file
    await writeFile(filePath, buffer);
    
    console.log(`File saved to ${filePath}`);
    
    return NextResponse.json({ 
      message: "File uploaded successfully",
      url: `/images/uploads/${filename}`
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Error uploading file" }, { status: 500 });
  }
}