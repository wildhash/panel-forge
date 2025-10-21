"use client";

import { useState } from "react";
import { createComic, savePage } from "@/app/actions/comic-actions";

interface Panel {
  panelNum: number;
  imageUrl?: string;
  prompt?: string;
  balloons?: string;
}

interface PageToolbarProps {
  panels?: Panel[];
}

export function PageToolbar({ panels = [] }: PageToolbarProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [comicId, setComicId] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let activeComicId = comicId;
      
      // Create a new comic if one doesn't exist
      if (!activeComicId) {
        const result = await createComic({ title: `Comic ${new Date().toLocaleDateString()}` });
        if (result.success && result.comic) {
          activeComicId = result.comic.id;
          setComicId(activeComicId);
        }
      }

      if (activeComicId) {
        // Save the page with all panels
        await savePage({
          comicId: activeComicId,
          pageNum: 1,
          panels: panels.map(p => ({
            panelNum: p.panelNum,
            imageUrl: p.imageUrl,
            prompt: p.prompt,
            balloons: p.balloons,
          })),
        });
        
        alert("Page saved to comic.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    alert("Export will save your comic as a high-resolution file.");
  };

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm text-gray-600">
        {comicId ? `Comic ${comicId.slice(0, 8)}` : "Unsaved"}
      </div>
      <button
        onClick={handleSave}
        disabled={isSaving}
        aria-label="Save page to comic"
        className="px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300"
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
      <button
        onClick={handleExport}
        aria-label="Export comic"
        className="px-4 py-2 text-sm border-2 border-gray-900 text-gray-900 hover:bg-gray-100"
      >
        Export
      </button>
    </div>
  );
}
