"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { getAssets } from "@/app/actions/comic-actions";

interface Asset {
  id: string;
  filename: string;
  fileUrl: string;
  createdAt: Date;
}

interface UploadDropzoneProps {
  onAssetSelect?: (asset: Asset) => void;
}

export function UploadDropzone({ onAssetSelect }: UploadDropzoneProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAssets = async () => {
    try {
      const loadedAssets = await getAssets();
      setAssets(loadedAssets as Asset[]);
    } catch (error) {
      console.error("Failed to load assets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-4xl">📁</div>
          <p className="text-gray-600">Upload images to create your comic panels</p>
          <UploadButton<OurFileRouter, "imageUploader">
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res) {
                // Reload assets after upload
                loadAssets();
              }
            }}
            onUploadError={(error: Error) => {
              alert(`Upload error: ${error.message}`);
            }}
          />
        </div>
        {isLoading ? (
          <div className="mt-4 text-gray-500">Loading assets...</div>
        ) : assets.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Uploaded Files ({assets.length}):</h3>
            <div className="grid grid-cols-4 gap-2">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="relative w-full h-24 cursor-move border-2 border-gray-200 rounded hover:border-blue-500 transition-colors"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", asset.fileUrl);
                  }}
                  onClick={() => onAssetSelect?.(asset)}
                  title={`Drag to panel or click: ${asset.filename}`}
                >
                  <Image
                    src={asset.fileUrl}
                    alt={asset.filename}
                    fill
                    className="object-cover rounded pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
