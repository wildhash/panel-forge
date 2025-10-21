import { getComic } from "@/app/actions/story-actions";
import { ComicViewer } from "@/components/ComicViewer";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ComicViewPage({ params }: { params: { id: string } }) {
  const comic = await getComic(params.id);

  if (!comic) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="container-xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/novels" className="text-gray-600 hover:text-gray-900 text-sm">
                ← Back to Novels
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">{comic.title}</h1>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/create?comicId=${comic.id}`}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg"
              >
                Continue Story
              </Link>
              <button
                onClick={() => {
                  // TODO: Implement export
                  alert("Export functionality coming soon!");
                }}
                className="px-4 py-2 text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 rounded-lg"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Comic Content */}
      <main className="container-xl mx-auto px-8 py-10">
        {/* Comic Info */}
        <div className="mb-10">
          <p className="text-gray-600 mb-2">{comic.description}</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>Art Style: <span className="font-medium text-gray-700">{comic.artStyle}</span></span>
            <span>•</span>
            <span>{comic.panelCount} panels</span>
            <span>•</span>
            <span>{comic.pages.length} {comic.pages.length === 1 ? 'strip' : 'strips'}</span>
            <span>•</span>
            <span>Created {new Date(comic.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* All Strips */}
        <div className="space-y-16">
          {comic.pages.map((page, index) => (
            <div key={page.id} className="border border-gray-200 rounded-2xl p-8 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                  Strip {index + 1}
                </h2>
                <span className="text-xs text-gray-500">
                  {page.panels.length} panels
                </span>
              </div>

              {/* Panels Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {page.panels.map((panel) => (
                  <div key={panel.id} className="space-y-3">
                    <div className="relative aspect-square border border-gray-900 overflow-hidden bg-gray-100 rounded-lg">
                      {panel.imageUrl && (
                        <img
                          src={panel.imageUrl}
                          alt={`Panel ${panel.panelNum}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-white px-3 py-2 border-t border-gray-900">
                        <p className="text-xs font-semibold text-gray-900 text-center uppercase tracking-wide">
                          {panel.panelNum === 1 && "Setup"}
                          {panel.panelNum === 2 && "Action"}
                          {panel.panelNum === 3 && "Payoff"}
                        </p>
                      </div>
                    </div>

                    {/* Caption */}
                    {panel.caption && (
                      <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-700 italic">"{panel.caption}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Continue Story CTA */}
        {comic.status === 'completed' && (
          <div className="mt-16 text-center p-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Continue Your Story</h3>
            <p className="text-gray-600 mb-6">Add more strips to expand your comic narrative</p>
            <Link
              href={`/create?comicId=${comic.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Add New Strip
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}




