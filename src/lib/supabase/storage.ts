"use client";

import { createClient } from "./client";
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique file names

const supabase = createClient();

export async function uploadFileToSupabase(file: File, bucketName: string, folderPath: string): Promise<string | null> {
  if (!file) {
    return null;
  }

  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`; // Generate a unique file name
  const filePath = `${folderPath}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error("Error uploading file to Supabase Storage:", error);
    return null;
  }

  // Get the public URL of the uploaded file
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}