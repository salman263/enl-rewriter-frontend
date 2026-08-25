"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("Professional");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRewrite = async () => {
    if (!text) return;
    setLoading(true);
    setResult("");
    setCopied(false);

    try {
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

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // ২ সেকেন্ড পর আবার Copy লেখায় ফিরে আসবে
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800 font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2 mt-4 sm:mt-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            AI Text Rewriter
          </h1>
          <p className="text-lg text-gray-600">Elevate your writing in seconds.</p>
        </div>

        {/* Main Editor Section */}
        <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-indigo-50 overflow-hidden">
          
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between border-b border-gray-100 p-4 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-600">Tone:</span>
              <select
                className="text-sm bg-white border border-gray-200 text-gray-700 py-1.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm cursor-pointer"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="Professional">👔 Professional</option>
                <option value="Casual">☕ Casual</option>
                <option value="Fluent">🌟 Fluent</option>
                <option value="Creative">🎨 Creative</option>
                <option value="Academic">📚 Academic</option>
              </select>
            </div>
            
            <button
              onClick={handleRewrite}
              disabled={loading || !text}
              className={`mt-3 sm:mt-0 px-6 py-2 rounded-full text-sm font-bold tracking-wide text-white transition-all shadow-md ${
                loading || !text
                  ? "bg-gray-400 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Rewriting...
                </span>
              ) : (
                "✨ Rewrite Text"
              )}
            </button>
          </div>

          {/* Text Areas Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            
            {/* Input Area */}
            <div className="p-4 sm:p-6 relative">
              <textarea
                className="w-full h-64 sm:h-80 resize-none bg-transparent border-none focus:ring-0 text-gray-700 text-lg leading-relaxed placeholder-gray-400 outline-none"
                placeholder="Paste or type your English text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="absolute bottom-4 right-4 text-xs font-medium text-gray-400">
                {text.length} characters
              </div>
            </div>

            {/* Output Area */}
            <div className="p-4 sm:p-6 bg-gray-50/30 relative group">
              {result ? (
                <div className="w-full h-64 sm:h-80 overflow-y-auto text-gray-800 text-lg leading-relaxed whitespace-pre-wrap outline-none">
                  {result}
                </div>
              ) : (
                <div className="w-full h-64 sm:h-80 flex items-center justify-center text-gray-400 text-lg select-none">
                  Your rewritten text will appear here...
                </div>
              )}

              {/* Copy Button */}
              {result && (
                <button
                  onClick={handleCopy}
                  className="absolute bottom-4 right-4 bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-300 p-2 rounded-lg shadow-md transition-all flex items-center gap-2 text-sm font-medium"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Copied!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      Copy
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-center text-sm text-gray-400 mt-8">
          Powered by Next.js & Google Gemini AI
        </p>
      </div>
    </div>
  );
}