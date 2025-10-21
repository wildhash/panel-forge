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
        
        alert("Page saved successfully!");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    alert("Export functionality coming soon!");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {comicId ? `Comic ID: ${comicId.slice(0, 8)}...` : "No comic created yet"}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300"
          >
            {isSaving ? "Saving..." : "Save Page"}
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
