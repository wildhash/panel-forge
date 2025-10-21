"use client";

import { useState } from "react";
import { UploadDropzone } from "@/components/UploadDropzone";
import { PanelGrid } from "@/components/PanelGrid";
import { PromptBar } from "@/components/PromptBar";
import { PageToolbar } from "@/components/PageToolbar";

interface Asset {
  id: string;
  filename: string;
  fileUrl: string;
  createdAt: Date;
}

interface Panel {
  panelNum: number;
  imageUrl?: string;
  prompt?: string;
  balloons?: string;
}

export function StudioClient() {
  const [panels, setPanels] = useState<Panel[]>([
    { panelNum: 1 },
    { panelNum: 2 },
    { panelNum: 3 },
    { panelNum: 4 },
  ]);

  const handlePanelUpdate = (updatedPanels: Panel[]) => {
    setPanels(updatedPanels);
  };

  return (
    <div className="space-y-6">
      <UploadDropzone />
      <PromptBar />
      <PanelGrid onPanelUpdate={handlePanelUpdate} />
      <PageToolbar panels={panels} />
    </div>
  );
}
