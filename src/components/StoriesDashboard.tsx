"use client";

import { useState, useEffect } from "react";
import { StoryCard } from "@/components/StoryCard";
import { Plus, Search, Filter, Grid, List } from "lucide-react";
import Link from "next/link";

interface Story {
  id: string;
  title: string;
  description: string;
  artStyle: string;
  createdAt: string;
  thumbnailUrl?: string;
  panelCount: number;
  status: 'draft' | 'completed' | 'generating';
}

export function StoriesDashboard() {
  const [stories, setStories] = useState<Story[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, this would come from API/database
  useEffect(() => {
    const mockStories: Story[] = [
      {
        id: "1",
        title: "The Superhero's First Flight",
        description: "A young hero discovers their ability to fly for the first time, soaring through the city skyline as they learn to control their newfound powers.",
        artStyle: "classic",
        createdAt: "2024-01-15",
        thumbnailUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=300&fit=crop",
        panelCount: 3,
        status: "completed"
      },
      {
        id: "2",
        title: "Space Adventure Begins",
        description: "An astronaut discovers a mysterious alien artifact on a distant planet, setting off an incredible journey across the galaxy.",
        artStyle: "graphic-novel",
        createdAt: "2024-01-14",
        thumbnailUrl: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=400&h=300&fit=crop",
        panelCount: 3,
        status: "generating"
      },
      {
        id: "3",
        title: "The Magic Forest",
        description: "A young wizard explores an enchanted forest filled with talking animals and ancient magic, learning about the balance between nature and power.",
        artStyle: "manga",
        createdAt: "2024-01-13",
        thumbnailUrl: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=300&fit=crop",
        panelCount: 3,
        status: "draft"
      },
      {
        id: "4",
        title: "Robot Rebellion",
        description: "In a futuristic city, robots have gained consciousness and must decide whether to coexist with humans or fight for their freedom.",
        artStyle: "retro-pulp",
        createdAt: "2024-01-12",
        thumbnailUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&h=300&fit=crop",
        panelCount: 3,
        status: "completed"
      },
      {
        id: "5",
        title: "Underwater Mystery",
        description: "Deep beneath the ocean, marine biologists discover an ancient underwater city that holds secrets about the origins of life on Earth.",
        artStyle: "minimalist",
        createdAt: "2024-01-11",
        thumbnailUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop",
        panelCount: 3,
        status: "draft"
      },
      {
        id: "6",
        title: "Time Travel Paradox",
        description: "A scientist accidentally travels back in time and must navigate the complexities of changing history while avoiding creating paradoxes.",
        artStyle: "classic",
        createdAt: "2024-01-10",
        thumbnailUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=300&fit=crop",
        panelCount: 3,
        status: "completed"
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setStories(mockStories);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || story.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleEditStory = (story: Story) => {
    // Navigate to edit mode
    console.log("Edit story:", story);
  };

  const handleDeleteStory = (story: Story) => {
    if (confirm(`Are you sure you want to delete "${story.title}"?`)) {
      setStories(prev => prev.filter(s => s.id !== story.id));
    }
  };

  const handleViewStory = (story: Story) => {
    // Navigate to view mode
    console.log("View story:", story);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Stories</h1>
          <p className="text-gray-600 mt-1">Create and manage your comic stories</p>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Story
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Stories</option>
            <option value="completed">Completed</option>
            <option value="generating">Generating</option>
            <option value="draft">Drafts</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stories Grid/List */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Start creating your first comic story!"
            }
          </p>
          {!searchTerm && filterStatus === "all" && (
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Story
            </Link>
          )}
        </div>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {filteredStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onEdit={handleEditStory}
              onDelete={handleDeleteStory}
              onView={handleViewStory}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-gray-900">{stories.length}</div>
          <div className="text-sm text-gray-600">Total Stories</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">
            {stories.filter(s => s.status === "completed").length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600">
            {stories.filter(s => s.status === "generating").length}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
      </div>
    </div>
  );
}
