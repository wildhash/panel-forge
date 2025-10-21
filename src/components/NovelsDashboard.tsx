"use client";

import { useState, useEffect } from "react";
import { NovelCard } from "@/components/NovelCard";
import { Search, Grid, List, BookOpen } from "lucide-react";
import Link from "next/link";
import { getAllComics, deleteComic } from "@/app/actions/story-actions";

interface Story {
  id: string;
  title: string;
  description: string;
  artStyle: string;
  createdAt: string;
  thumbnailUrl?: string;
  panelCount: number;
  status: 'draft' | 'generating' | 'completed';
}

export function NovelsDashboard() {
  const [stories, setStories] = useState<Story[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

  // Load stories from database
  useEffect(() => {
    async function loadStories() {
      try {
        const comics = await getAllComics();
        const formattedStories: Story[] = comics.map(comic => ({
          id: comic.id,
          title: comic.title,
          description: comic.description || "",
          artStyle: comic.artStyle || "classic",
          createdAt: comic.createdAt.toISOString(),
          thumbnailUrl: comic.thumbnailUrl || undefined,
          panelCount: comic.panelCount,
          status: comic.status as 'draft' | 'generating' | 'completed',
        }));
        setStories(formattedStories);
      } catch (error) {
        console.error("Failed to load stories:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStories();
  }, []);

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || story.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleEditStory = (story: Story) => {
    window.location.href = `/create?comicId=${story.id}`;
  };

  const handleDeleteStory = async (story: Story) => {
    if (confirm(`Are you sure you want to delete "${story.title}"?`)) {
      try {
        await deleteComic(story.id);
        setStories(prev => prev.filter(s => s.id !== story.id));
      } catch (error) {
        console.error("Failed to delete story:", error);
        alert("Failed to delete story");
      }
    }
  };

  const handleViewStory = (story: Story) => {
    window.location.href = `/novels/${story.id}`;
  };

  const getArtStyleLabel = (key: string) => {
    const styles: Record<string, string> = {
      'classic': 'Classic Comic Book',
      'manga': 'Manga Style',
      'graphic-novel': 'Graphic Novel',
      'retro-pulp': 'Retro Pulp',
      'minimalist': 'Minimalist',
    };
    return styles[key] || key;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="container-xl mx-auto">
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your stories...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="container-xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                ← Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Novel Forge</h1>
            </div>
            <Link
              href="/create"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
            >
              Create New Novel
            </Link>
          </div>
        </div>
      </header>

      <main className="container-xl mx-auto px-8 py-10">
        {/* Page Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">My Novels</h2>
          <p className="text-gray-600">Create and manage your novel writing projects</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search novels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white"
          >
            <option value="all">All Novels</option>
            <option value="draft">Draft</option>
            <option value="generating">Generating</option>
            <option value="completed">Completed</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-lg border transition-colors ${
                viewMode === "grid"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-3 rounded-lg border transition-colors ${
                viewMode === "list"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {filteredStories.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {stories.length === 0 ? "No novels yet" : "No matching novels"}
            </h3>
            <p className="text-gray-600 mb-6">
              {stories.length === 0 
                ? "Start creating your first comic novel!"
                : "Try adjusting your search or filter"}
            </p>
            {stories.length === 0 && (
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Create Your First Novel
              </Link>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredStories.map((story) => (
              <NovelCard
                key={story.id}
                novel={{
                  ...story,
                  genre: getArtStyleLabel(story.artStyle),
                  author: "You",
                  coverUrl: story.thumbnailUrl,
                  wordCount: story.panelCount * 100, // Rough estimate
                  chapters: Math.ceil(story.panelCount / 3), // Assume 3 panels per chapter
                }}
                onEdit={() => handleEditStory(story)}
                onDelete={() => handleDeleteStory(story)}
                onView={() => handleViewStory(story)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
