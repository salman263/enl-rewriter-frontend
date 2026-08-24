"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("Professional");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRewrite = async () => {
    if (!text) return;
    setLoading(true);
    setResult("");

    try {
      // এখানে আপনার Render-এর লাইভ লিংকটি বসানো হয়েছে
      const res = await fetch("https://enl-rewriter-backend.onrender.com/api/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text, tone: tone }),
      });

      const data = await res.json();
      setResult(data.rewritten_text || data.result || "No result found.");
    } catch (error) {
      console.error(error);
      setResult("Something went wrong! Please check your connection or try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">AI Text Rewriter</h1>
          <p className="mt-2 text-lg text-gray-600">Rewrite your English text instantly like a Pro!</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your text here:
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
              rows={5}
              placeholder="Paste your English text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Tone:</label>
            <select
              className="p-2 border border-gray-300 rounded-md text-black"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="Professional">Professional</option>
              <option value="Casual">Casual</option>
              <option value="Fluent">Fluent</option>
              <option value="Creative">Creative</option>
            </select>
            
            <button
              onClick={handleRewrite}
              disabled={loading || !text}
              className={`px-6 py-2 rounded-md text-white font-medium ${
                loading || !text ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Rewriting..." : "Rewrite Text"}
            </button>
          </div>

          {result && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rewritten Result:
              </label>
              <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-md text-gray-800 min-h-[120px] whitespace-pre-wrap">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}