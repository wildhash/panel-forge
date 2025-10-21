"use client";

import { useState } from "react";

export default function TestAPIPage() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testAPI = async () => {
    setTesting(true);
    setResult(null);

    try {
      console.log("🧪 Testing OpenAI API connection...");
      
      const response = await fetch("/api/comic-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: "A superhero flies over a city",
          artStyle: "classic",
          characterDescription: "superhero in red cape",
          hasReferenceImages: false,
        }),
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API Error:", errorData);
        setResult({
          success: false,
          error: errorData.error,
          details: errorData,
        });
        setTesting(false);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let panels: any[] = [];

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6));
              console.log("📦 Received:", data);

              if (data.error) {
                setResult({
                  success: false,
                  error: data.message,
                  details: data,
                });
                setTesting(false);
                return;
              }

              if (data.imageUrl) {
                panels.push({
                  panelNumber: data.panelNumber,
                  imageUrl: data.imageUrl,
                });
              }

              if (data.complete) {
                setResult({
                  success: true,
                  panels: panels,
                  message: "✅ All panels generated successfully!",
                });
                setTesting(false);
                return;
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error("❌ Test failed:", error);
      setResult({
        success: false,
        error: error.message,
        details: error,
      });
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            OpenAI API Test Page
          </h1>
          <p className="text-gray-600 mb-8">
            Test your OpenAI API connection and comic generation
          </p>

          <button
            onClick={testAPI}
            disabled={testing}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg active:scale-95 font-semibold"
          >
            {testing ? "Testing API..." : "Test OpenAI API"}
          </button>

          {testing && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-blue-900 font-medium">
                  Testing API connection and generating test comic...
                </p>
              </div>
              <p className="text-sm text-blue-700 mt-2">
                This may take 60-90 seconds. Check the browser console and terminal for detailed logs.
              </p>
            </div>
          )}

          {result && (
            <div className="mt-8">
              {result.success ? (
                <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                  <h2 className="text-xl font-bold text-green-900 mb-4">
                    ✅ Success!
                  </h2>
                  <p className="text-green-800 mb-4">{result.message}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {result.panels?.map((panel: any) => (
                      <div key={panel.panelNumber} className="border-2 border-green-300 rounded-lg overflow-hidden">
                        <img
                          src={panel.imageUrl}
                          alt={`Panel ${panel.panelNumber}`}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-2 bg-white text-center">
                          <p className="text-sm font-medium text-gray-900">
                            Panel {panel.panelNumber}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-white rounded border border-green-200">
                    <h3 className="font-semibold text-gray-900 mb-2">What this means:</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✅ OpenAI API key is valid</li>
                      <li>✅ DALL-E 3 access is working</li>
                      <li>✅ Image generation is functional</li>
                      <li>✅ All 3 panels generated successfully</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg">
                  <h2 className="text-xl font-bold text-red-900 mb-4">
                    ❌ Test Failed
                  </h2>
                  <p className="text-red-800 mb-4">
                    <strong>Error:</strong> {result.error}
                  </p>

                  <div className="mt-4 p-4 bg-white rounded border border-red-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Troubleshooting:</h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>
                        <strong>401 Unauthorized:</strong> API key is invalid or expired
                        <br />→ Check https://platform.openai.com/api-keys
                      </li>
                      <li>
                        <strong>429 Rate Limit:</strong> Too many requests or no credits
                        <br />→ Check https://platform.openai.com/account/usage
                      </li>
                      <li>
                        <strong>404 Not Found:</strong> Model access issue
                        <br />→ Ensure your account has DALL-E 3 access
                      </li>
                      <li>
                        <strong>500 Server Error:</strong> OpenAI service issue
                        <br />→ Check https://status.openai.com/
                      </li>
                    </ul>
                  </div>

                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      Show technical details
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">What to check:</h3>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Open browser console (F12) to see detailed logs</li>
              <li>Check the terminal where <code className="bg-gray-200 px-1 rounded">npm run dev</code> is running</li>
              <li>Look for emoji-marked logs (🎨 ✅ ❌) in the terminal</li>
              <li>Verify your OpenAI API key at <a href="https://platform.openai.com/api-keys" className="text-blue-600 hover:underline" target="_blank" rel="noopener">platform.openai.com</a></li>
              <li>Check your usage and credits at <a href="https://platform.openai.com/account/usage" className="text-blue-600 hover:underline" target="_blank" rel="noopener">account/usage</a></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

