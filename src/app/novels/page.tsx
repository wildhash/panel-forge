"use client";

import { NovelsDashboard } from "@/components/NovelsDashboard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NovelsPage() {
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
                Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Novel Forge</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/novel/create"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Create New Novel
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NovelsDashboard />
      </main>
    </div>
  );
}
