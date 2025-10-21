"use client";

import { useState } from "react";
import Image from "next/image";

interface Panel {
  panelNumber: number;
  imageUrl: string | null;
  isGenerating: boolean;
  caption?: string;
}

interface ComicStripProps {
  panels: Panel[];
  onRegeneratePanel?: (panelNumber: number) => void;
  onIteratePanel?: (panelNumber: number, additionalPrompt: string) => void;
  onCaptionChange?: (panelNumber: number, caption: string) => void;
  onExport?: () => void;
  isGenerating?: boolean;
}

export function ComicStrip({ 
  panels, 
  onRegeneratePanel,
  onIteratePanel,
  onCaptionChange,
  onExport,
  isGenerating = false 
}: ComicStripProps) {
  const [hoveredPanel, setHoveredPanel] = useState<number | null>(null);
  const [iteratingPanel, setIteratingPanel] = useState<number | null>(null);
  const [iterationPrompt, setIterationPrompt] = useState("");
  const [editingCaption, setEditingCaption] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* Comic Strip Container */}
      <div className="border border-gray-200 rounded-2xl p-10 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-base font-semibold uppercase tracking-wider text-gray-900">Comic Strip</h2>
          {onExport && (
            <button
              onClick={onExport}
              disabled={panels.some(p => !p.imageUrl) || isGenerating}
              aria-label="Export comic strip"
              className="px-6 py-3 text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg active:scale-95 rounded-full"
            >
              Export
            </button>
          )}
        </div>

        {/* 3-Panel Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {panels.map((panel) => (
            <div
              key={panel.panelNumber}
              className="relative aspect-[3/4] border-2 border-gray-900 overflow-hidden bg-gray-100 group transition-all duration-200 hover:shadow-2xl rounded-xl"
              onMouseEnter={() => setHoveredPanel(panel.panelNumber)}
              onMouseLeave={() => setHoveredPanel(null)}
            >
              {/* Panel Content */}
              {panel.isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                  <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mb-6" />
                  <p className="text-base font-medium text-gray-900">Generating panel {panel.panelNumber}...</p>
                  <div className="mt-6 flex gap-2">
                    <div className="w-3 h-3 bg-gray-900 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-3 h-3 bg-gray-900 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-3 h-3 bg-gray-900 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              ) : panel.imageUrl ? (
                <>
                  <Image
                    src={panel.imageUrl}
                    alt={`Panel ${panel.panelNumber}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                    priority={panel.panelNumber === 1}
                    onError={(e) => {
                      console.error(`❌ Failed to load image for panel ${panel.panelNumber}:`, panel.imageUrl);
                    }}
                    onLoad={() => {
                      console.log(`✅ Image loaded successfully for panel ${panel.panelNumber}`);
                    }}
                  />
                  
                  {/* Regenerate/Iterate Button (shows on hover) */}
                  {hoveredPanel === panel.panelNumber && !panel.isGenerating && (
                    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-2 p-4">
                      {iteratingPanel === panel.panelNumber ? (
                        <>
                          <input
                            type="text"
                            value={iterationPrompt}
                            onChange={(e) => setIterationPrompt(e.target.value)}
                            placeholder="Refine this panel..."
                            className="w-full px-3 py-2 text-sm border border-white rounded-lg text-white bg-black/50 focus:outline-none focus:ring-2 focus:ring-white"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && iterationPrompt.trim()) {
                                onIteratePanel?.(panel.panelNumber, iterationPrompt);
                                setIterationPrompt("");
                                setIteratingPanel(null);
                              }
                            }}
                            autoFocus
                          />
                          <div className="flex gap-2 w-full">
                            <button
                              onClick={() => {
                                if (iterationPrompt.trim()) {
                                  onIteratePanel?.(panel.panelNumber, iterationPrompt);
                                  setIterationPrompt("");
                                  setIteratingPanel(null);
                                }
                              }}
                              className="flex-1 px-3 py-2 bg-white text-gray-900 hover:bg-gray-200 text-sm font-medium rounded-lg"
                            >
                              Apply
                            </button>
                            <button
                              onClick={() => {
                                setIteratingPanel(null);
                                setIterationPrompt("");
                              }}
                              className="px-3 py-2 border border-white text-white hover:bg-white/10 text-sm rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {onRegeneratePanel && (
                            <button
                              onClick={() => onRegeneratePanel(panel.panelNumber)}
                              aria-label={`Regenerate panel ${panel.panelNumber}`}
                              className="px-4 py-2 bg-white text-gray-900 hover:bg-gray-200 text-sm font-medium w-full rounded-lg"
                            >
                              Regenerate
                            </button>
                          )}
                          {onIteratePanel && (
                            <button
                              onClick={() => setIteratingPanel(panel.panelNumber)}
                              aria-label={`Iterate on panel ${panel.panelNumber}`}
                              className="px-4 py-2 border border-white text-white hover:bg-white/10 text-sm font-medium w-full rounded-lg"
                            >
                              Refine with Prompt
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                  <p className="text-base text-gray-500 font-medium">Panel {panel.panelNumber}</p>
                </div>
              )}

              {              /* Panel Type Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3 border-t-2 border-gray-900">
                <p className="text-sm font-bold text-gray-900 text-center uppercase tracking-wide">
                  {panel.panelNumber === 1 && "Setup"}
                  {panel.panelNumber === 2 && "Action"}
                  {panel.panelNumber === 3 && "Payoff"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Captions Section */}
        {panels.some(p => p.imageUrl) && (
          <div className="mt-10">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900">Panel Captions</h3>
              <p className="text-sm text-gray-600 mt-1">AI-generated captions for each panel. Edit them as needed.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {panels.map((panel) => (
                <div key={`caption-${panel.panelNumber}`}>
                  {panel.imageUrl && (
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700">
                        Panel {panel.panelNumber} Caption
                      </label>
                      <textarea
                        value={panel.caption || ""}
                        onChange={(e) => onCaptionChange?.(panel.panelNumber, e.target.value)}
                        placeholder={`Enter caption for panel ${panel.panelNumber}...`}
                        rows={4}
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none resize-none"
                      />
                      <p className="text-xs text-gray-500 font-medium">
                        {panel.caption?.length || 0}/150 characters
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strip Info */}
        <div className="mt-10 p-8 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl">
          <p className="text-base text-gray-700 leading-relaxed">
            Each panel tells part of your story. Visual continuity is maintained across all frames using consistent character descriptions and art style.
          </p>
        </div>
      </div>
    </div>
  );
}

