import { getAllComics } from "@/app/actions/story-actions";
import Link from "next/link";
import { BarChart3, TrendingUp, Palette, Image as ImageIcon } from "lucide-react";

export default async function AnalyticsPage() {
  const comics = await getAllComics();

  // Calculate stats
  const totalComics = comics.length;
  const totalPanels = comics.reduce((sum, comic) => sum + comic.panelCount, 0);
  
  const styleStats = comics.reduce((acc, comic) => {
    const style = comic.artStyle || 'unknown';
    acc[style] = (acc[style] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostPopularStyle = Object.entries(styleStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  
  const recentComics = comics.slice(0, 5);

  const avgPanelsPerComic = totalComics > 0 ? (totalPanels / totalComics).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container-xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                ← Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Analytics Dashboard
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container-xl mx-auto px-8 py-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Comics */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Total Comics</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-900">{totalComics}</p>
            <p className="text-xs text-blue-600 mt-1">Stories created</p>
          </div>

          {/* Total Panels */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-700">Total Panels</span>
              <ImageIcon className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-900">{totalPanels}</p>
            <p className="text-xs text-purple-600 mt-1">Panels generated</p>
          </div>

          {/* Avg Panels */}
          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700">Avg Panels/Comic</span>
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-900">{avgPanelsPerComic}</p>
            <p className="text-xs text-green-600 mt-1">Average length</p>
          </div>

          {/* Popular Style */}
          <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-700">Popular Style</span>
              <Palette className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-yellow-900 capitalize">{mostPopularStyle}</p>
            <p className="text-xs text-yellow-600 mt-1">Most used</p>
          </div>
        </div>

        {/* Art Style Breakdown */}
        <div className="mb-12 border border-gray-200 rounded-xl p-8 bg-white">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Art Style Distribution</h2>
          <div className="space-y-4">
            {Object.entries(styleStats).map(([style, count]) => {
              const percentage = ((count / totalComics) * 100).toFixed(1);
              return (
                <div key={style}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{style}</span>
                    <span className="text-sm text-gray-600">{count} comics ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Comics */}
        <div className="border border-gray-200 rounded-xl p-8 bg-white">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Comics</h2>
          {recentComics.length > 0 ? (
            <div className="space-y-4">
              {recentComics.map((comic) => (
                <Link
                  key={comic.id}
                  href={`/novels/${comic.id}`}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {comic.thumbnailUrl && (
                      <img
                        src={comic.thumbnailUrl}
                        alt={comic.title}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{comic.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">{comic.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{comic.panelCount} panels</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comic.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No comics yet. Start creating!</p>
          )}
        </div>
      </main>
    </div>
  );
}




