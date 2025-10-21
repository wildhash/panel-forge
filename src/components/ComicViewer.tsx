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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Comic Preview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {panels.map((panel) => (
          <div key={panel.id} className="relative aspect-square border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
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
                    className="absolute bg-white border-2 border-black rounded-full px-4 py-2 text-sm font-comic"
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
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <p>No image</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
