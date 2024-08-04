import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  const { file } = await req.json();
  
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      upload_preset: 'ml_default',
    });
    return NextResponse.json({ url: uploadResponse.secure_url }, { status: 200 });
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return NextResponse.json({ message: "Error uploading image" }, { status: 500 });
  }
}
