import { NextRequest, NextResponse } from "next/server";

// For serverless environments, we'll use a data URL approach
export async function POST(req: NextRequest) {
  try {
    console.log("Upload API called");
    
    const formData = await req.formData();
    const file = formData.get("file");
    
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No valid file uploaded" }, { status: 400 });
    }
    
    console.log("File received:", file.name, file.type, file.size);
    
    try {
      // Create a unique filename for reference
      const timestamp = Date.now();
      const safeFilename = file.name?.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '') || 'image.jpg';
      
      // Convert file to base64 data URL
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      
      // Return the data URL directly
      return NextResponse.json({ 
        success: true,
        url: dataUrl,
        filename: `${timestamp}-${safeFilename}`
      });
    } catch (error: any) {
      console.error("Data processing error:", error);
      return NextResponse.json({ 
        error: "Failed to process image data" 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: "Server error processing upload" 
    }, { status: 500 });
  }
}