"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AIInputWithSearch } from "@/components/ui/ai-input-with-search";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

// Comic art style examples - using appropriate stock images
const artStyles = [
  { 
    key: 'classic',
    title: 'Classic Comic Book',
    description: 'Bold lines, vibrant colors',
    imageSrc: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=300&h=400&fit=crop&q=80'
  },
  { 
    key: 'manga',
    title: 'Manga Style',
    description: 'Screentone shading, dynamic angles',
    imageSrc: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=300&h=400&fit=crop&q=80'
  },
  { 
    key: 'graphic-novel',
    title: 'Graphic Novel',
    description: 'Realistic, muted tones',
    imageSrc: 'https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=300&h=400&fit=crop&q=80'
  },
  { 
    key: 'retro-pulp',
    title: 'Retro Pulp',
    description: 'Vintage comic aesthetic',
    imageSrc: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=300&h=400&fit=crop&q=80'
  },
  { 
    key: 'minimalist',
    title: 'Minimalist Line Art',
    description: 'Simple, clean lines',
    imageSrc: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=400&fit=crop&q=80'
  },
];

export default function HomePage() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  
  const handleStartCreating = (story: string, files: File[]) => {
    if (!story.trim()) {
      alert("Enter a story description to continue.");
      return;
    }

    if (!selectedStyle) {
      alert("Select an art style before creating.");
      return;
    }
    
    // Navigate to create page with story and style
    const params = new URLSearchParams({
      story: story,
      style: selectedStyle
    });
    router.push(`/create?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white" role="navigation" aria-label="Main navigation">
        <div className="container-xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Panel Forge</h1>
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-full">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-5 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-all duration-200 hover:shadow-lg active:scale-95 rounded-full">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/stories"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                My Stories
              </Link>
              <Link
                href="/create"
                className="px-5 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-all duration-200 hover:shadow-lg active:scale-95 rounded-full"
              >
                Create
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>

      <main className="px-8 py-24">
        {/* Header */}
        <header className="container-lg mb-24" role="banner">
          <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Create Comic Strips<br />with AI
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Turn your story into a three-panel comic strip. Choose an art style, describe your story, and generate professional comic panels in minutes.
          </p>
        </header>

        {/* Input Box */}
        <div className="container-md mx-auto mb-16">
          <AIInputWithSearch 
            placeholder="Describe your comic story... (e.g., 'A superhero discovers their powers for the first time')"
            onSubmit={handleStartCreating}
            onFileSelect={(file) => {
              console.log('Selected file:', file);
            }}
          />
          <p className="text-center text-sm text-gray-500 mt-2">
            {selectedStyle 
              ? `Selected style: ${artStyles.find(s => s.key === selectedStyle)?.title || 'Classic Comic Book'}`
              : 'Choose an art style below, then describe your story'}
          </p>
        </div>

        {/* Art Styles Section */}
        <section className="container-xl mx-auto mb-32" aria-label="Art style selection">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-10">Choose Your Style</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {artStyles.map((style) => (
              <button
                key={style.key}
                onClick={() => setSelectedStyle(style.key)}
                aria-label={`Select ${style.title} art style`}
                aria-pressed={selectedStyle === style.key}
                className={`group text-left border transition-all duration-200 overflow-hidden rounded-xl ${
                  selectedStyle === style.key 
                    ? 'border-gray-900 shadow-xl ring-2 ring-gray-900 ring-offset-2' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                <div className="aspect-2/3 overflow-hidden bg-gray-100">
                  <img
                    src={style.imageSrc}
                    alt={style.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 bg-white">
                  <p className="font-semibold text-gray-900">{style.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{style.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="container-lg mx-auto pb-32" aria-label="Features">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center md:text-left">
              <div className="w-12 h-12 bg-gray-900 mb-4 mx-auto md:mx-0 rounded-lg"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Three-Panel Structure</h3>
              <p className="text-gray-600 leading-relaxed">
                Every comic strip follows classic storytelling: setup, action, and payoff.
              </p>
            </div>
            <div className="text-center md:text-left">
              <div className="w-12 h-12 bg-gray-900 mb-4 mx-auto md:mx-0 rounded-lg"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Visual Continuity</h3>
              <p className="text-gray-600 leading-relaxed">
                Characters and settings stay consistent across all panels using AI.
              </p>
            </div>
            <div className="text-center md:text-left">
              <div className="w-12 h-12 bg-gray-900 mb-4 mx-auto md:mx-0 rounded-lg"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Fast Generation</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate professional comic strips in minutes, not hours.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
