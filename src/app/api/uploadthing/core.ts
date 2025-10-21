import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const f = createUploadthing();

// Allowed image types
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const ourFileRouter = {
  imageUploader: f({ 
    image: { 
      maxFileSize: "4MB", 
      maxFileCount: 10,
    } 
  })
    .middleware(async ({ files }) => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
      
      // Validate file types
      for (const file of files) {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          throw new Error(`Invalid file type: ${file.type}. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`);
        }
        
        // Additional size check (belt and suspenders)
        if (file.size > 4 * 1024 * 1024) {
          throw new Error(`File too large: ${file.name}. Maximum size is 4MB.`);
        }
      }
      
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      // Save asset to database with validation
      try {
        // Validate file type again
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          console.error("Invalid file type after upload:", file.type);
          throw new Error("Invalid file type");
        }

        const asset = await prisma.asset.create({
          data: {
            userId: metadata.userId,
            filename: file.name,
            fileUrl: file.url,
            fileKey: file.key,
            mimeType: file.type,
            size: file.size,
          },
        });
        
        console.log("Asset saved to database:", asset.id);
        return { uploadedBy: metadata.userId, url: file.url, assetId: asset.id };
      } catch (error) {
        console.error("Failed to save asset to database:", error);
        return { uploadedBy: metadata.userId, url: file.url };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
