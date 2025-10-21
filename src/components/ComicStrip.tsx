"use client";

import { useState } from "react";
import Image from "next/image";
import { RefreshCw, Download, Loader2 } from "lucide-react";

interface Panel {
  panelNumber: number;
  imageUrl: string | null;
  isGenerating: boolean;
}

interface ComicStripProps {
  panels: Panel[];
  onRegeneratePanel?: (panelNumber: number) => void;
  onExport?: () => void;
  isGenerating?: boolean;
}

export function ComicStrip({ 
  panels, 
  onRegeneratePanel, 
  onExport,
  isGenerating = false 
}: ComicStripProps) {
  const [hoveredPanel, setHoveredPanel] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* Comic Strip Container */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Comic Strip</h2>
          {onExport && (
            <button
              onClick={onExport}
              disabled={panels.some(p => !p.imageUrl) || isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Strip
            </button>
          )}
        </div>

        {/* 3-Panel Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {panels.map((panel) => (
            <div
              key={panel.panelNumber}
              className="relative aspect-square border-4 border-gray-800 rounded-lg overflow-hidden bg-gray-100 group"
              onMouseEnter={() => setHoveredPanel(panel.panelNumber)}
              onMouseLeave={() => setHoveredPanel(null)}
            >
              {/* Panel Number Badge */}
              <div className="absolute top-2 left-2 z-10 bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
                Panel {panel.panelNumber}
              </div>

              {/* Panel Content */}
              {panel.isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-2" />
                  <p className="text-gray-600 font-medium">Generating...</p>
                </div>
              ) : panel.imageUrl ? (
                <>
                  <Image
                    src={panel.imageUrl}
                    alt={`Comic Panel ${panel.panelNumber}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  
                  {/* Regenerate Button (shows on hover) */}
                  {onRegeneratePanel && hoveredPanel === panel.panelNumber && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity">
                      <button
                        onClick={() => onRegeneratePanel(panel.panelNumber)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-100 font-medium transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl mb-2">🖼️</div>
                  <p className="text-gray-500 font-medium">Empty Panel</p>
                </div>
              )}

              {/* Panel Type Label */}
              <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                {panel.panelNumber === 1 && "Setup"}
                {panel.panelNumber === 2 && "Action"}
                {panel.panelNumber === 3 && "Payoff"}
              </div>
            </div>
          ))}
        </div>

        {/* Strip Info */}
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Classic 3-Panel Comic Strip:</span> Each panel tells part of your story with visual continuity maintained across all frames.
          </p>
        </div>
      </div>
    </div>
  );
}

