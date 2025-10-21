"use client";

import Image from "next/image";

interface Panel {
  id: string;
  imageUrl?: string;
  balloons?: Array<{ text: string; x: number; y: number }>;
}

interface ComicViewerProps {
  panels: Panel[];
}

export function ComicViewer({ panels }: ComicViewerProps) {
  return (
    <div className="border-2 border-gray-200 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-900 mb-6">Preview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {panels.map((panel) => (
          <div key={panel.id} className="relative aspect-square border-2 border-gray-900 overflow-hidden bg-gray-100">
            {panel.imageUrl ? (
              <>
                <Image
                  src={panel.imageUrl}
                  alt={`Panel ${panel.id}`}
                  fill
                  className="object-cover"
                />
                {panel.balloons?.map((balloon, idx) => (
                  <div
                    key={idx}
                    className="absolute bg-white border-2 border-black px-4 py-2 text-sm"
                    style={{
                      left: `${balloon.x}%`,
                      top: `${balloon.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {balloon.text}
                  </div>
                ))}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <p className="text-sm">No image</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
