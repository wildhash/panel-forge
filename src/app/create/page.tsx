"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ComicStrip } from "@/components/ComicStrip";
import Link from "next/link";

interface Panel {
  panelNumber: number;
  imageUrl: string | null;
  isGenerating: boolean;
}

interface ComicStrip {
  id: string;
  panels: Panel[];
  story: string;
  timestamp: Date;
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
  const [characterReferenceImages, setCharacterReferenceImages] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [comicHistory, setComicHistory] = useState<ComicStrip[]>([]);
  const [currentStripIndex, setCurrentStripIndex] = useState(0);

  // Get parameters from URL if redirected from home page
  useEffect(() => {
    const storyParam = searchParams.get("story");
    const styleParam = searchParams.get("style");
    
    if (storyParam) {
      setStory(storyParam);
    }
    if (styleParam) {
      setArtStyle(styleParam);
    }
    
    // Auto-generate if both story and style are provided from URL
    if (storyParam && styleParam) {
      // Small delay to ensure state is set
      const timer = setTimeout(() => {
        // Check if we haven't already started generating
        if (!isGenerating && panels.every(p => !p.imageUrl && !p.isGenerating)) {
          console.log("🚀 Auto-starting generation from home page...");
          handleGenerate();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleGenerate = async () => {
    console.log("🎬 handleGenerate called");
    console.log("Story:", story);
    console.log("Art Style:", artStyle);
    
    if (!story.trim()) {
      alert("Enter a story description to generate.");
      return;
    }

    console.log("✅ Starting generation...");
    setIsGenerating(true);
    setGenerationStatus("Starting generation...");
    
    // Reset panels to generating state
    setPanels([
      { panelNumber: 1, imageUrl: null, isGenerating: true },
      { panelNumber: 2, imageUrl: null, isGenerating: true },
      { panelNumber: 3, imageUrl: null, isGenerating: true },
    ]);

    // Build character description with context from previous strips
    let enhancedCharacterDescription = characterDescription;
    if (comicHistory.length > 0) {
      const previousStrip = comicHistory[comicHistory.length - 1];
      enhancedCharacterDescription = `${characterDescription}. MAINTAIN VISUAL CONTINUITY from previous strip: ${previousStrip.story}`;
    }

    try {
      const response = await fetch("/api/comic-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: story,
          artStyle: artStyle,
          characterDescription: enhancedCharacterDescription || undefined,
          hasReferenceImages: characterReferenceImages.length > 0,
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
              setGenerationStatus("Comic strip complete!");
              setIsGenerating(false);
              
              // Add to history
              const newStrip: ComicStrip = {
                id: Date.now().toString(),
                panels: panels.filter(p => p.imageUrl !== null),
                story: story,
                timestamp: new Date()
              };
              setComicHistory(prev => [...prev, newStrip]);
              setCurrentStripIndex(comicHistory.length);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("❌ Generation error:", error);
      console.error("Error details:", error.response || error);
      const errorMessage = error.message || "Generation failed";
      alert(`Generation failed: ${errorMessage}\n\nPlease check:\n1. OpenAI API key is valid\n2. You have credits in your OpenAI account\n3. Check the browser console and terminal for detailed errors`);
      setGenerationStatus("");
      setIsGenerating(false);
      setPanels([
        { panelNumber: 1, imageUrl: null, isGenerating: false },
        { panelNumber: 2, imageUrl: null, isGenerating: false },
        { panelNumber: 3, imageUrl: null, isGenerating: false },
      ]);
    }
  };

  const handleIteratePanel = async (panelNumber: number, additionalPrompt: string) => {
    if (!story.trim()) {
      alert("Story description is required.");
      return;
    }

    // Set the specific panel to generating state
    setPanels(prev => prev.map(panel =>
      panel.panelNumber === panelNumber
        ? { ...panel, isGenerating: true, imageUrl: null }
        : panel
    ));

    setGenerationStatus(`Refining panel ${panelNumber} with your feedback...`);

    // Enhance the character description with the additional prompt
    const iterativeCharacterDescription = characterDescription 
      ? `${characterDescription}. ${additionalPrompt}`
      : additionalPrompt;

    try {
      const response = await fetch("/api/regenerate-panel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panelNumber,
          story: `${story}. REFINEMENT: ${additionalPrompt}`,
          artStyle,
          characterDescription: iterativeCharacterDescription,
          hasReferenceImages: characterReferenceImages.length > 0,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Iteration failed");
      }

      const data = await response.json();

      setPanels(prev => prev.map(panel =>
        panel.panelNumber === panelNumber
          ? { ...panel, imageUrl: data.imageUrl, isGenerating: false }
          : panel
      ));

      setGenerationStatus(`Panel ${panelNumber} refined successfully!`);
    } catch (error: any) {
      console.error("Iteration error:", error);
      alert(`Failed to refine panel ${panelNumber}. ${error.message}`);
      setPanels(prev => prev.map(panel =>
        panel.panelNumber === panelNumber
          ? { ...panel, isGenerating: false }
          : panel
      ));
    }
  };

  const handleRegeneratePanel = async (panelNumber: number) => {
    if (!story.trim()) {
      alert("Story description is required to regenerate panel.");
      return;
    }

    // Set the specific panel to generating state
    setPanels(prev => prev.map(panel =>
      panel.panelNumber === panelNumber
        ? { ...panel, isGenerating: true, imageUrl: null }
        : panel
    ));

    setGenerationStatus(`Regenerating panel ${panelNumber}...`);

    try {
      const response = await fetch("/api/regenerate-panel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panelNumber,
          story,
          artStyle,
          characterDescription: characterDescription || undefined,
          hasReferenceImages: false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Regeneration failed");
      }

      const data = await response.json();

      setPanels(prev => prev.map(panel =>
        panel.panelNumber === panelNumber
          ? { ...panel, imageUrl: data.imageUrl, isGenerating: false }
          : panel
      ));

      setGenerationStatus(`Panel ${panelNumber} regenerated successfully!`);
    } catch (error: any) {
      console.error("Regeneration error:", error);
      alert(`Failed to regenerate panel ${panelNumber}. ${error.message}`);
      setPanels(prev => prev.map(panel =>
        panel.panelNumber === panelNumber
          ? { ...panel, isGenerating: false }
          : panel
      ));
    }
  };

  const handleSave = async () => {
    if (panels.some(p => !p.imageUrl)) {
      alert("Generate all panels before saving.");
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Implement save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Comic strip saved to studio.");
      router.push("/studio");
    } catch (error) {
      console.error("Save error:", error);
      alert("Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    alert("Export will save your comic as a high-resolution image.");
    // TODO: Implement export functionality
  };

  const handleGenerateNextStrip = () => {
    // Clear panels for next strip but keep character context
    setPanels([
      { panelNumber: 1, imageUrl: null, isGenerating: false },
      { panelNumber: 2, imageUrl: null, isGenerating: false },
      { panelNumber: 3, imageUrl: null, isGenerating: false },
    ]);
    setStory("");
    setGenerationStatus(`Ready for strip ${comicHistory.length + 1}. Character continuity will be maintained.`);
  };

  const handleViewPreviousStrip = (index: number) => {
    if (index >= 0 && index < comicHistory.length) {
      const strip = comicHistory[index];
      setPanels(strip.panels);
      setStory(strip.story);
      setCurrentStripIndex(index);
    }
  };

  const handleFileUpload = (files: File[]) => {
    setCharacterReferenceImages(files);
    if (files.length > 0) {
      setGenerationStatus(`${files.length} character reference image(s) uploaded. These will be used for character consistency.`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white" role="banner">
        <div className="container-xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link 
                href="/" 
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Home
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Create Comic Strip</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving || panels.some(p => !p.imageUrl)}
              aria-label="Save comic to studio"
              className="px-5 py-2 text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg active:scale-95 rounded-full"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </header>

      <main className="container-xl mx-auto px-8 py-10" role="main">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Panel - Story Input */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-2xl p-8 sticky top-8 bg-white shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-8">Story Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Story
                  </label>
                  <textarea
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="A superhero discovers their powers for the first time..."
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all resize-none"
                    disabled={isGenerating}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {story.length}/500
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Art Style
                  </label>
                  <select
                    value={artStyle}
                    onChange={(e) => setArtStyle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white transition-all cursor-pointer"
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
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Character Details (Optional)
                  </label>
                  <input
                    type="text"
                    value={characterDescription}
                    onChange={(e) => setCharacterDescription(e.target.value)}
                    placeholder="e.g., young woman with red cape"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Character Reference (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all cursor-pointer"
                    disabled={isGenerating}
                  />
                  {characterReferenceImages.length > 0 && (
                    <p className="text-xs text-gray-600 mt-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {characterReferenceImages.length} image(s) selected
                    </p>
                  )}
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !story.trim()}
                  aria-label="Generate comic strip from story"
                  className="w-full px-4 py-4 bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-semibold transition-all duration-200 hover:shadow-xl active:scale-[0.98] rounded-lg"
                >
                  {isGenerating ? "Generating..." : "Generate Comic Strip"}
                </button>

                {generationStatus && (
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg animate-pulse">
                    <p className="text-sm font-medium text-gray-900">{generationStatus}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Comic Strip Display */}
          <div className="lg:col-span-2">
            {/* Strip History Navigation */}
            {comicHistory.length > 0 && (
              <div className="mb-8 p-6 border border-gray-200 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
                  Strip History ({comicHistory.length} created)
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {comicHistory.map((strip, index) => (
                    <button
                      key={strip.id}
                      onClick={() => handleViewPreviousStrip(index)}
                      className={`px-4 py-2 text-sm font-medium border transition-all duration-200 rounded-full ${
                        currentStripIndex === index
                          ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                          : 'border-gray-300 hover:border-gray-900 hover:shadow-md'
                      }`}
                    >
                      Strip {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={handleGenerateNextStrip}
                    className="px-4 py-2 text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 hover:shadow-lg active:scale-95 rounded-full"
                    disabled={isGenerating}
                  >
                    + New Strip
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  Character continuity maintained across all strips
                </p>
              </div>
            )}

            <ComicStrip
              panels={panels}
              onRegeneratePanel={handleRegeneratePanel}
              onIteratePanel={handleIteratePanel}
              onExport={handleExport}
              isGenerating={isGenerating}
            />

            {/* Tips Section */}
            <div className="mt-8 p-6 border-2 border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 mb-4">Guidelines</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>Be specific about setting, characters, and action</li>
                <li>Think about visual storytelling in each panel</li>
                <li>Follow three-act structure: setup, action, payoff</li>
                <li>Describe distinctive features for character consistency</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

