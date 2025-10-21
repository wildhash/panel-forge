"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Edit, Trash2, Calendar, BookOpen, MoreVertical, User } from "lucide-react";

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

interface NovelCardProps {
  novel: Novel;
  onEdit?: (novel: Novel) => void;
  onDelete?: (novel: Novel) => void;
  onView?: (novel: Novel) => void;
}

export function NovelCard({ novel, onEdit, onDelete, onView }: NovelCardProps) {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'writing': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatWordCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M words`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K words`;
    return `${count} words`;
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
      {/* Cover */}
      <div className="relative h-64 bg-linear-to-br from-blue-50 to-purple-50">
        {novel.coverUrl ? (
          <Image
            src={novel.coverUrl}
            alt={novel.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No cover</p>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(novel.status)}`}>
            {novel.status}
          </span>
        </div>

        {/* Genre Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-black/80 text-white">
            {novel.genre}
          </span>
        </div>

        {/* Actions Menu */}
        <div className="absolute bottom-3 right-3">
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 bottom-8 bg-white rounded-md shadow-lg border py-1 z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    onView?.(novel);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Read
                </button>
                <button
                  onClick={() => {
                    onEdit?.(novel);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete?.(novel);
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
          {novel.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {novel.description}
        </p>

        {/* Author */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <User className="w-3 h-3" />
          <span>{novel.author}</span>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(novel.createdAt)}
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {novel.chapters} chapters
          </div>
        </div>

        {/* Word Count and Action */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 font-medium">
            {formatWordCount(novel.wordCount)}
          </span>
          
          <Link
            href={`/novel/edit/${novel.id}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {novel.status === 'completed' ? 'Read' : 'Continue Writing'}
          </Link>
        </div>
      </div>
    </div>
  );
}
