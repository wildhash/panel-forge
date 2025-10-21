"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AIInputWithSearch } from "@/components/ui/ai-input-with-search";
import { BlurFade } from "@/components/ui/blur-fade"
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

// Comic art style examples - using real comic book style images
const artStyles = [
  { 
    key: 'classic',
    title: 'Classic Comic Book',
    description: 'Bold lines, vibrant colors',
    imageSrc: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop'
  },
  { 
    key: 'manga',
    title: 'Manga Style',
    description: 'Screentone shading, dynamic angles',
    imageSrc: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop'
  },
  { 
    key: 'graphic-novel',
    title: 'Graphic Novel',
    description: 'Realistic, muted tones',
    imageSrc: 'https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=400&h=600&fit=crop'
  },
  { 
    key: 'retro-pulp',
    title: 'Retro Pulp',
    description: 'Vintage comic aesthetic',
    imageSrc: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&h=600&fit=crop'
  },
  { 
    key: 'minimalist',
    title: 'Minimalist Line Art',
    description: 'Simple, clean lines',
    imageSrc: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=600&fit=crop'
  },
];

export default function HomePage() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  
  // Determine greeting based on current hour
  const hour = new Date().getHours();
  let timeOfDay;
  if (hour < 12) timeOfDay = 'Morning';
  else if (hour < 18) timeOfDay = 'Afternoon';
  else timeOfDay = 'Evening';
  
  const handleStartCreating = (story: string, files: File[]) => {
    if (!story.trim()) {
      alert("Please describe your comic story first!");
      return;
    }
    
    // Navigate to create page with story and style
    const style = selectedStyle || 'classic';
    const params = new URLSearchParams({
      story: story,
      style: style
    });
    router.push(`/create?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        )}
      />
      
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Story Forge</h1>
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/stories"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                My Comics
              </Link>
              <Link
                href="/novels"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                My Novels
              </Link>
              <Link
                href="/create"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Create Comic
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>

      <div className="p-8 relative z-10">
        {/* Header */}
        <header className="text-center mb-12">
          <BlurFade delay={0.25} inView>
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              {`Good ${timeOfDay}, Creator`}
            </h2>
          </BlurFade>
          <div className="opacity-0 h-0">hidden</div>
          <BlurFade delay={0.25 * 2} inView>
            <span className="animate-fade-in font-[Outfit] text-[16px] font-normal text-[#737880] sm:text-[20px]">
              Ready to turn your story into comics or novels?
            </span>
          </BlurFade>
        </header>

        {/* Input Box */}
        <div className="max-w-2xl mx-auto mb-16">
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
        <section className="max-w-6xl mx-auto">
          <BlurFade delay={0.25 * 3} inView>
            <h2 className="text-2xl font-semibold mb-6">Choose Your Art Style</h2>
          </BlurFade>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {artStyles.map((style, index) => (
              <BlurFade key={style.key} delay={0.25 * (4 + index * 0.5)} inView>
                <div 
                  onClick={() => setSelectedStyle(style.key)}
                  className={cn(
                    "relative group rounded-xl overflow-hidden cursor-pointer transition-all",
                    selectedStyle === style.key && "ring-4 ring-blue-500 scale-105"
                  )}
                >
                  <div className="w-full h-[300px] object-cover rounded-2xl overflow-hidden">
                    <img
                      src={style.imageSrc}
                      alt={style.title}
                      className="w-full h-[300px] object-cover rounded-2xl group-hover:scale-110 duration-300 transition-all"
                    />
                  </div>
                  <div className="absolute left-0 right-0 top-0 m-4 flex h-[30px] w-[29px] items-center justify-start gap-1 overflow-hidden rounded-full bg-[rgba(51,51,51,0.8)] transition-all duration-300 group-hover:w-[72px]">
                    <Image 
                      width={28} 
                      height={28} 
                      src="https://www.lovart.ai/assets/play-s.svg" 
                      alt="Select"
                    />
                    <span className="text-[rgba(255,255,255,0.8)] sm:text-[14px] sm:font-[700]">
                      Select
                    </span>
                  </div>
                  <div className="text-center mt-2 pb-4">
                    <p className="font-medium">{style.title}</p>
                    <p className="text-sm text-gray-500">{style.description}</p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="max-w-6xl mx-auto mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BlurFade delay={0.5} inView>
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="text-3xl mb-4">📖</div>
                <h3 className="text-xl font-semibold mb-2">3-Panel Stories</h3>
                <p className="text-gray-600">
                  Every comic strip follows classic storytelling: setup, action, and payoff.
                </p>
              </div>
            </BlurFade>
            <BlurFade delay={0.6} inView>
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-2">Visual Continuity</h3>
                <p className="text-gray-600">
                  Characters and settings stay consistent across all panels using AI.
                </p>
              </div>
            </BlurFade>
            <BlurFade delay={0.7} inView>
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Fast Generation</h3>
                <p className="text-gray-600">
                  Go from idea to finished comic strip in minutes, not hours.
                </p>
              </div>
            </BlurFade>
          </div>
        </section>
      </div>
    </div>
  );
}
