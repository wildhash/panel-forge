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
    <div className="border-2 border-gray-200 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-900 mb-6">Upload Images</h2>
      <div className="border-2 border-gray-300 p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-sm text-gray-700">Upload images to create your comic panels</p>
          <UploadButton<OurFileRouter, "imageUploader">
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res) {
                // Reload assets after upload
                loadAssets();
              }
            }}
            onUploadError={(error: Error) => {
              alert(`Upload failed: ${error.message}`);
            }}
          />
        </div>
        {isLoading ? (
          <div className="mt-4 text-sm text-gray-500">Loading assets...</div>
        ) : assets.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Uploaded Files ({assets.length})</h3>
            <div className="grid grid-cols-4 gap-2">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="relative w-full h-24 cursor-move border-2 border-gray-200 hover:border-gray-900"
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
                    className="object-cover pointer-events-none"
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
