"use client";

import { useState } from "react";

export function PromptBar() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Generation failed");
      }

      await response.json();
      alert("Panel generated. Check your comic.");
    } catch (error) {
      console.error("Generation error:", error);
      alert("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="border-2 border-gray-200 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-900 mb-6">Generate Panel</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to generate..."
          className="flex-1 px-4 py-2 border-2 border-gray-200 focus:border-gray-900 focus:outline-none"
          disabled={isGenerating}
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          aria-label="Generate panel from prompt"
          className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
        >
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
}
