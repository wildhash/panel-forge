"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export function UploadDropzone() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

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
                const urls = res.map((file) => file.url);
                setUploadedFiles([...uploadedFiles, ...urls]);
                alert("Upload complete!");
              }
            }}
            onUploadError={(error: Error) => {
              alert(`Upload error: ${error.message}`);
            }}
          />
        </div>
        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Uploaded Files:</h3>
            <div className="grid grid-cols-4 gap-2">
              {uploadedFiles.map((url, index) => (
                <div key={index} className="relative w-full h-24">
                  <Image
                    src={url}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
