"use client";

import { useState, useEffect } from "react";
import { NovelCard } from "@/components/NovelCard";
import { Plus, Search, Filter, Grid, List, BookOpen, PenTool } from "lucide-react";
import Link from "next/link";

interface Novel {
  id: string;
  title: string;
  description: string;
  genre: string;
  createdAt: string;
  coverUrl?: string;
  wordCount: number;
  status: 'draft' | 'writing' | 'completed' | 'published';
  chapters: number;
  author: string;
}

export function NovelsDashboard() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);

  // Mock novel data
  useEffect(() => {
    const mockNovels: Novel[] = [
      {
        id: "1",
        title: "The Last Dragon's Song",
        description: "In a world where dragons have been extinct for centuries, a young scholar discovers an ancient egg that begins to glow with mysterious energy. As she tries to understand its power, she uncovers a conspiracy that threatens to rewrite history itself.",
        genre: "Fantasy",
        createdAt: "2024-01-15",
        coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
        wordCount: 125000,
        status: "completed",
        chapters: 24,
        author: "Sarah Chen"
      },
      {
        id: "2",
        title: "Quantum Dreams",
        description: "A brilliant physicist discovers how to enter dreams through quantum entanglement. But when she becomes trapped in a nightmare that's bleeding into reality, she must navigate the subconscious minds of strangers to find her way back home.",
        genre: "Sci-Fi",
        createdAt: "2024-01-14",
        coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop",
        wordCount: 89000,
        status: "writing",
        chapters: 18,
        author: "Marcus Rodriguez"
      },
      {
        id: "3",
        title: "The Memory Thief",
        description: "In a dystopian future where memories can be bought and sold, a memory thief discovers she's been stealing her own past. As she pieces together fragments of her true identity, she realizes she's the key to overthrowing the corrupt memory market.",
        genre: "Dystopian",
        createdAt: "2024-01-13",
        coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
        wordCount: 156000,
        status: "draft",
        chapters: 32,
        author: "Elena Volkov"
      },
      {
        id: "4",
        title: "Midnight in Paris",
        description: "A struggling writer finds herself transported to 1920s Paris every night at midnight. As she befriends the Lost Generation writers, she must choose between staying in the past with her literary heroes or returning to her modern life.",
        genre: "Historical Fiction",
        createdAt: "2024-01-12",
        coverUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=400&fit=crop",
        wordCount: 98000,
        status: "completed",
        chapters: 20,
        author: "James Mitchell"
      },
      {
        id: "5",
        title: "The Silent Library",
        description: "A librarian discovers that books in her library are disappearing and reappearing with different endings. When she realizes she can influence the stories by writing in the margins, she must decide whether to fix fictional tragedies or let them stand.",
        genre: "Magical Realism",
        createdAt: "2024-01-11",
        coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
        wordCount: 112000,
        status: "writing",
        chapters: 22,
        author: "Amara Singh"
      },
      {
        id: "6",
        title: "Neon Ghosts",
        description: "In a cyberpunk future where consciousness can be uploaded to the net, a detective must solve murders that occur in virtual reality. But when the victims' digital ghosts start appearing in the real world, she realizes the line between virtual and reality has been erased.",
        genre: "Cyberpunk",
        createdAt: "2024-01-10",
        coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop",
        wordCount: 134000,
        status: "published",
        chapters: 28,
        author: "Alex Kim"
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setNovels(mockNovels);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredNovels = novels.filter(novel => {
    const matchesSearch = novel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         novel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         novel.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || novel.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleEditNovel = (novel: Novel) => {
    alert(`Edit novel: ${novel.title}`);
  };

  const handleDeleteNovel = (novel: Novel) => {
    if (confirm(`Are you sure you want to delete "${novel.title}"?`)) {
      setNovels(prev => prev.filter(n => n.id !== novel.id));
    }
  };

  const handleViewNovel = (novel: Novel) => {
    alert(`View novel: ${novel.title}`);
  };

  const formatWordCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
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
          <h1 className="text-3xl font-bold text-gray-900">My Novels</h1>
          <p className="text-gray-600 mt-1">Create and manage your novel writing projects</p>
        </div>
        <Link
          href="/novel/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Novel
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
              placeholder="Search novels..."
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
            <option value="all">All Novels</option>
            <option value="completed">Completed</option>
            <option value="writing">Writing</option>
            <option value="draft">Drafts</option>
            <option value="published">Published</option>
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

      {/* Novels Grid/List */}
      {filteredNovels.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No novels found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Start writing your first novel!"
            }
          </p>
          {!searchTerm && filterStatus === "all" && (
            <Link
              href="/novel/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <PenTool className="w-4 h-4" />
              Start Writing
            </Link>
          )}
        </div>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {filteredNovels.map((novel) => (
            <NovelCard
              key={novel.id}
              novel={novel}
              onEdit={handleEditNovel}
              onDelete={handleDeleteNovel}
              onView={handleViewNovel}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-gray-900">{novels.length}</div>
          <div className="text-sm text-gray-600">Total Novels</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">
            {novels.filter(n => n.status === "completed").length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">
            {novels.filter(n => n.status === "writing").length}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">
            {novels.reduce((sum, n) => sum + n.wordCount, 0) > 1000000 
              ? `${(novels.reduce((sum, n) => sum + n.wordCount, 0) / 1000000).toFixed(1)}M`
              : `${formatWordCount(novels.reduce((sum, n) => sum + n.wordCount, 0))}K`
            }
          </div>
          <div className="text-sm text-gray-600">Total Words</div>
        </div>
      </div>
    </div>
  );
}
