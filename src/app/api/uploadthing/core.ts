import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      // Save asset to database
      try {
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
        
        return { uploadedBy: metadata.userId, url: file.url, assetId: asset.id };
      } catch (error) {
        console.error("Failed to save asset to database:", error);
        return { uploadedBy: metadata.userId, url: file.url };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
