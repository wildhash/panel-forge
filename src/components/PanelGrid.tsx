"use client";

import { useState } from "react";
import Image from "next/image";

interface Panel {
  id: string;
  imageUrl?: string;
  prompt?: string;
  balloons?: Array<{ text: string; x: number; y: number }>;
}

export function PanelGrid() {
  const [panels] = useState<Panel[]>([
    { id: "1", imageUrl: undefined, prompt: "" },
    { id: "2", imageUrl: undefined, prompt: "" },
    { id: "3", imageUrl: undefined, prompt: "" },
    { id: "4", imageUrl: undefined, prompt: "" },
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Comic Panels</h2>
      <div className="grid grid-cols-2 gap-4">
        {panels.map((panel) => (
          <div
            key={panel.id}
            className="aspect-square border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer relative overflow-hidden"
          >
            {panel.imageUrl ? (
              <Image
                src={panel.imageUrl}
                alt={`Panel ${panel.id}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-sm">Panel {panel.id}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
