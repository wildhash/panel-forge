import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Panel Forge</h1>
          <div>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/studio"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Go to Studio
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
            Turn your photos into
            <span className="text-blue-600"> comics</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your photos, add prompts, and create editable multi-panel comics in minutes.
            Perfect for storytelling, social media, and creative projects.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg">
                  Get Started
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/studio"
                className="px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg"
              >
                Open Studio
              </Link>
            </SignedIn>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📸</div>
            <h3 className="text-xl font-semibold mb-2">Upload Photos</h3>
            <p className="text-gray-600">
              Start with your own photos or images to create the perfect comic panels.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2">Add Prompts</h3>
            <p className="text-gray-600">
              Use AI-powered tools to generate and iterate on your comic panels.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Edit Balloons</h3>
            <p className="text-gray-600">
              Add speech bubbles and text to bring your comic story to life.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
