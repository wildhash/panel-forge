"use client";

import { useState } from "react";
import Image from "next/image";
import { BalloonEditor } from "./BalloonEditor";

interface Panel {
  panelNum: number;
  imageUrl?: string;
  prompt?: string;
  balloons?: string; // JSON string
}

interface Balloon {
  id: string;
  text: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  tail?: { x: number; y: number };
}

interface PanelGridProps {
  onPanelUpdate?: (panels: Panel[]) => void;
}

export function PanelGrid({ onPanelUpdate }: PanelGridProps) {
  const [panels, setPanels] = useState<Panel[]>([
    { panelNum: 1 },
    { panelNum: 2 },
    { panelNum: 3 },
    { panelNum: 4 },
  ]);
  const [selectedPanel, setSelectedPanel] = useState<number | null>(null);

  const handleAssetDrop = (panelNum: number, imageUrl: string) => {
    const updatedPanels = panels.map((p) =>
      p.panelNum === panelNum ? { ...p, imageUrl } : p
    );
    setPanels(updatedPanels);
    onPanelUpdate?.(updatedPanels);
  };

  const handlePanelClick = (panelNum: number) => {
    setSelectedPanel(selectedPanel === panelNum ? null : panelNum);
  };

  const handleBalloonsChange = (panelNum: number, balloons: Balloon[]) => {
    const updatedPanels = panels.map((p) =>
      p.panelNum === panelNum ? { ...p, balloons: JSON.stringify(balloons) } : p
    );
    setPanels(updatedPanels);
    onPanelUpdate?.(updatedPanels);
  };

  const getSelectedPanelBalloons = (): Balloon[] => {
    if (selectedPanel === null) return [];
    const panel = panels.find((p) => p.panelNum === selectedPanel);
    if (!panel?.balloons) return [];
    try {
      return JSON.parse(panel.balloons);
    } catch {
      return [];
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Comic Panels</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {panels.map((panel) => (
          <div
            key={panel.panelNum}
            className={`aspect-square border-2 rounded-lg flex items-center justify-center bg-gray-50 hover:border-blue-400 transition-colors cursor-pointer relative overflow-hidden ${
              selectedPanel === panel.panelNum ? "border-blue-600 ring-2 ring-blue-300" : "border-gray-300"
            }`}
            onClick={() => handlePanelClick(panel.panelNum)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const imageUrl = e.dataTransfer.getData("text/plain");
              if (imageUrl) {
                handleAssetDrop(panel.panelNum, imageUrl);
              }
            }}
          >
            {panel.imageUrl ? (
              <Image
                src={panel.imageUrl}
                alt={`Panel ${panel.panelNum}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-sm">Panel {panel.panelNum}</p>
                <p className="text-xs mt-1">Drop image here</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedPanel !== null && (
        <BalloonEditor
          balloons={getSelectedPanelBalloons()}
          onBalloonsChange={(balloons) => handleBalloonsChange(selectedPanel, balloons)}
        />
      )}
    </div>
  );
}
