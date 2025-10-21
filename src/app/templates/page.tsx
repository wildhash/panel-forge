"use client";

import { useState } from "react";
import { COMIC_TEMPLATES, getTemplateCategories } from "@/data/comic-templates";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, BookOpen } from "lucide-react";

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const categories = ['all', ...getTemplateCategories()];

  const filteredTemplates = selectedCategory === 'all' 
    ? COMIC_TEMPLATES 
    : COMIC_TEMPLATES.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = (template: typeof COMIC_TEMPLATES[0]) => {
    const params = new URLSearchParams({
      story: template.storyPrompt,
      style: template.recommendedStyle,
      character: template.characterHint || "",
    });
    router.push(`/create?${params.toString()}`);
  };

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
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  Comic Templates
                </h1>
                <p className="text-sm text-gray-600">Quick start with pre-made story ideas</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container-xl mx-auto px-8 py-10">
        {/* Category Filter */}
        <div className="mb-10 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-200 group cursor-pointer"
              onClick={() => handleSelectTemplate(template)}
            >
              {/* Thumbnail */}
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img
                  src={template.thumbnail}
                  alt={template.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {template.category}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    {template.recommendedStyle}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {template.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {template.description}
                </p>

                <button className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold">
                  Use This Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-24">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No templates found
            </h3>
            <p className="text-gray-600">
              Try selecting a different category
            </p>
          </div>
        )}
      </main>
    </div>
  );
}




