"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Edit, Trash2, Calendar, Palette, MoreVertical } from "lucide-react";

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

interface StoryCardProps {
  story: Story;
  onEdit?: (story: Story) => void;
  onDelete?: (story: Story) => void;
  onView?: (story: Story) => void;
}

export function StoryCard({ story, onEdit, onDelete, onView }: StoryCardProps) {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getArtStyleLabel = (style: string) => {
    const styleMap: { [key: string]: string } = {
      'classic': 'Classic Comic',
      'manga': 'Manga Style',
      'graphic-novel': 'Graphic Novel',
      'retro-pulp': 'Retro Pulp',
      'minimalist': 'Minimalist'
    };
    return styleMap[style] || style;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative h-48 bg-linear-to-br from-blue-50 to-purple-50">
        {story.thumbnailUrl ? (
          <Image
            src={story.thumbnailUrl}
            alt={story.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📖</div>
              <p className="text-sm text-gray-500">No preview</p>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(story.status)}`}>
            {story.status}
          </span>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-8 bg-white rounded-md shadow-lg border py-1 z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    onView?.(story);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => {
                    onEdit?.(story);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete?.(story);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {story.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {story.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(story.createdAt)}
          </div>
          <div className="flex items-center gap-1">
            <Palette className="w-3 h-3" />
            {getArtStyleLabel(story.artStyle)}
          </div>
        </div>

        {/* Panel Count */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {story.panelCount} panel{story.panelCount !== 1 ? 's' : ''}
          </span>
          
          <Link
            href={`/create?story=${encodeURIComponent(story.description)}&style=${story.artStyle}&edit=${story.id}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {story.status === 'completed' ? 'View' : 'Continue'}
          </Link>
        </div>
      </div>
    </div>
  );
}