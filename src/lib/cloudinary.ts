"use server";

import { v2 as cloudinary, UploadApiOptions } from "cloudinary";

// ==========================================================================================================

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ==========================================================================================================

export async function uploadImageToCloudinary(file: File | undefined, id?: string): Promise<string | undefined> {
  if (!file) {
    return;
  }

  const buffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(buffer);
  const options: UploadApiOptions = {
    resource_type: "image",
    quality: "auto",
    width: 1200,
    height: 1200,
    crop: "limit",
    fetch_format: "auto",
    flags: "progressive",
  };

  if (id) {
    options.public_id = id;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(new Error(`Cloudinary upload failed: ${error.message}`));
      } else if (!result) {
        reject(new Error("Aucun résultat renvoyé par Cloudinary."));
      } else {
        resolve(result.secure_url);
      }
    });

    uploadStream.end(fileBuffer);
  });
}

// ==========================================================================================================

export async function deleteImageFromCloudinary(id: string): Promise<void> {
  await cloudinary.uploader.destroy(id);
}

// ==========================================================================================================
