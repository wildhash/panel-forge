"use client";

import { useState } from "react";

export function PageToolbar() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // This would call a server action to save the page
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Page saved successfully!");
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
    <div className="flex gap-2">
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300"
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
      <button
        onClick={handleExport}
        className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
      >
        Export
      </button>
    </div>
  );
}
