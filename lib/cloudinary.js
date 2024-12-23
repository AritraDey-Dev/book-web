import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file, folder) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file, { folder }, (error, result) => {
      if (error) reject(error);
      resolve(result.secure_url);
    });
  });
}
