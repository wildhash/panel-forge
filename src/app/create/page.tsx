"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ComicStrip } from "@/components/ComicStrip";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";

interface Panel {
  panelNumber: number;
  imageUrl: string | null;
  isGenerating: boolean;
}

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [panels, setPanels] = useState<Panel[]>([
    { panelNumber: 1, imageUrl: null, isGenerating: false },
    { panelNumber: 2, imageUrl: null, isGenerating: false },
    { panelNumber: 3, imageUrl: null, isGenerating: false },
  ]);
  
  const [story, setStory] = useState("");
  const [artStyle, setArtStyle] = useState("classic");
  const [characterDescription, setCharacterDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Get parameters from URL if redirected from home page
  useEffect(() => {
    const storyParam = searchParams.get("story");
    const styleParam = searchParams.get("style");
    if (storyParam) setStory(storyParam);
    if (styleParam) setArtStyle(styleParam);
  }, [searchParams]);

  const handleGenerate = async () => {
    if (!story.trim()) {
      alert("Please enter a story description");
      return;
    }

    setIsGenerating(true);
    setGenerationStatus("Starting generation...");
    
    // Reset panels to generating state
    setPanels([
      { panelNumber: 1, imageUrl: null, isGenerating: true },
      { panelNumber: 2, imageUrl: null, isGenerating: true },
      { panelNumber: 3, imageUrl: null, isGenerating: true },
    ]);

    try {
      const response = await fetch("/api/comic-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: story,
          artStyle: artStyle,
          characterDescription: characterDescription || undefined,
          hasReferenceImages: false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Generation failed");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response stream");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            
            if (data.error) {
              throw new Error(data.message);
            }

            setGenerationStatus(data.message);

            if (data.imageUrl && data.panelNumber) {
              setPanels(prev => prev.map(panel => 
                panel.panelNumber === data.panelNumber
                  ? { ...panel, imageUrl: data.imageUrl, isGenerating: false }
                  : panel
              ));
            }

            if (data.complete) {
              setGenerationStatus("Comic strip complete! 🎉");
              setIsGenerating(false);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      alert(`Generation failed: ${error.message}`);
      setIsGenerating(false);
      setPanels([
        { panelNumber: 1, imageUrl: null, isGenerating: false },
        { panelNumber: 2, imageUrl: null, isGenerating: false },
        { panelNumber: 3, imageUrl: null, isGenerating: false },
      ]);
    }
  };

  const handleRegeneratePanel = async (panelNumber: number) => {
    alert(`Panel regeneration coming soon! Panel ${panelNumber} will be regenerated with variations.`);
    // TODO: Implement individual panel regeneration
  };

  const handleSave = async () => {
    if (panels.some(p => !p.imageUrl)) {
      alert("Please generate all panels before saving");
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Implement save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Comic strip saved! Check the studio to see your work.");
      router.push("/studio");
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save comic strip");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    alert("Export feature coming soon! Will export as high-res image.");
    // TODO: Implement export functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Comic Creator</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving || panels.some(p => !p.imageUrl)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save to Studio"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Story Input */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Story Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Story
                  </label>
                  <textarea
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="A superhero discovers their powers for the first time..."
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isGenerating}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {story.length}/500 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Art Style
                  </label>
                  <select
                    value={artStyle}
                    onChange={(e) => setArtStyle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isGenerating}
                  >
                    <option value="classic">Classic Comic Book</option>
                    <option value="manga">Manga Style</option>
                    <option value="graphic-novel">Graphic Novel</option>
                    <option value="retro-pulp">Retro Pulp</option>
                    <option value="minimalist">Minimalist Line Art</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Character Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={characterDescription}
                    onChange={(e) => setCharacterDescription(e.target.value)}
                    placeholder="e.g., young woman with red cape"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isGenerating}
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !story.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed font-medium transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  {isGenerating ? "Generating..." : "Generate Comic Strip"}
                </button>

                {generationStatus && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">{generationStatus}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Comic Strip Display */}
          <div className="lg:col-span-2">
            <ComicStrip
              panels={panels}
              onRegeneratePanel={handleRegeneratePanel}
              onExport={handleExport}
              isGenerating={isGenerating}
            />

            {/* Tips Section */}
            <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Tips for Great Comics</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Be specific:</strong> Include details about setting, characters, and action</li>
                <li>• <strong>Visual storytelling:</strong> Think about what viewers will see in each panel</li>
                <li>• <strong>3-Act structure:</strong> Setup → Action → Payoff</li>
                <li>• <strong>Character consistency:</strong> Describe distinctive features to maintain appearance</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

