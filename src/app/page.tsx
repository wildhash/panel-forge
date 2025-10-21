"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AIInputWithSearch } from "@/components/ui/ai-input-with-search";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { OnboardingTour } from "@/components/OnboardingTour";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

// Comic art style examples - using reliable comic book-related images
const artStyles = [
  { 
    key: 'classic',
    title: 'Classic Comic Book',
    description: 'Bold lines, vibrant colors',
    imageSrc: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=300&h=400&fit=crop&q=80' // Comic books collection
  },
  { 
    key: 'manga',
    title: 'Manga Style',
    description: 'Screentone shading, dynamic angles',
    imageSrc: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=300&h=400&fit=crop&q=80' // Manga books
  },
  { 
    key: 'graphic-novel',
    title: 'Graphic Novel',
    description: 'Realistic, muted tones',
    imageSrc: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&q=80' // Book on table
  },
  { 
    key: 'retro-pulp',
    title: 'Retro Pulp',
    description: 'Vintage comic aesthetic',
    imageSrc: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=300&h=400&fit=crop&q=80' // Vintage books/magazines
  },
  { 
    key: 'minimalist',
    title: 'Minimalist Line Art',
    description: 'Simple, clean lines',
    imageSrc: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300&h=400&fit=crop&q=80' // Minimalist art
  },
];

export default function HomePage() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();
  
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
      {/* Onboarding Tour */}
      <OnboardingTour />
      
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white" role="navigation" aria-label="Main navigation">
        <div className="container-xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="Panel Forge Logo" 
              width={40} 
              height={40}
              className="object-contain"
            />
            <h1 className="text-xl font-semibold text-gray-900">Panel Forge</h1>
          </div>
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
                      href="/novels"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      My Novels
                    </Link>
                    <Link
                      href="/templates"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Templates
                    </Link>
                    <Link
                      href="/analytics"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Analytics
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
                <p className="text-xl text-gray-600 max-w-2xl leading-relaxed mb-8">
                  Turn your story into a three-panel comic strip. Choose an art style, describe your story, and generate professional comic panels in minutes.
                </p>
                <div className="flex gap-4">
                  <Link
                    href="/templates"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                  >
                    Browse Templates
                  </Link>
                  <Link
                    href="/create"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                  >
                    Start from Scratch
                  </Link>
                </div>
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

      </main>
    </div>
  );
}
