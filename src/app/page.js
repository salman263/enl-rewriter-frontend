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
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-purple-200">
      
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            W
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-800">WordAI Clone</h1>
        </div>
      </header>

      {/* Main Editor Section */}
      <main className="max-w-6xl mx-auto mt-8 px-4 sm:px-6 pb-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row min-h-[550px]">

          {/* Left Side - Input */}
          <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-gray-100 relative">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Original Text</span>
              <button 
                onClick={() => setText('')} 
                className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            </div>
            
            <textarea
              className="flex-1 p-6 w-full resize-none border-none focus:ring-0 text-gray-700 text-[17px] leading-relaxed placeholder-gray-300 bg-transparent outline-none"
              placeholder="Type or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            
            {/* Toolbar at bottom of input */}
            <div className="p-4 flex flex-wrap items-center justify-between bg-white border-t border-gray-100 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium hidden sm:block">Rewrite in:</span>
                <select
                  className="text-sm bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all cursor-pointer font-medium hover:bg-gray-50"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="Professional">Professional</option>
                  <option value="Casual">Casual</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Creative">Creative</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>
              
              <button
                onClick={handleRewrite}
                disabled={loading || !text}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all flex items-center gap-2 ${
                  loading || !text
                    ? "bg-purple-300 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-200"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <span>Rewrite</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Side - Output */}
          <div className="flex-1 flex flex-col bg-[#FCFCFD]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Rewritten Output</span>
              {result && (
                <button
                  onClick={handleCopy}
                  className="text-sm flex items-center gap-1.5 text-gray-500 hover:text-purple-600 transition-colors font-medium bg-white border border-gray-200 px-3 py-1 rounded-md shadow-sm"
                >
                  {copied ? (
                    <span className="text-green-600 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Copied!</span>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>Copy text</>
                  )}
                </button>
              )}
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              {result ? (
                <div className="text-gray-800 text-[17px] leading-relaxed whitespace-pre-wrap outline-none">
                  {result}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 select-none opacity-50">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <p className="text-sm font-medium">Your polished text will appear here</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}