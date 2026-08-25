"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("Professional");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Word count calculation
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

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
    <div className="min-h-screen bg-[#F3F4F6] text-gray-900 font-sans selection:bg-indigo-100">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer">
          {/* WordAi Logo style */}
          <div className="bg-indigo-600 text-white font-black text-xl w-9 h-9 flex items-center justify-center rounded-lg shadow-md">
            W
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-gray-800">
            Word<span className="text-indigo-600">Ai</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <a href="#" className="text-indigo-600 border-b-2 border-indigo-600 py-5">Rewrite</a>
          <a href="#" className="hover:text-indigo-600 transition-colors py-5">History</a>
          <a href="#" className="hover:text-indigo-600 transition-colors py-5">API</a>
          <div className="ml-4 w-9 h-9 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-200 cursor-pointer transition-colors">
            ME
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-[1400px] mx-auto mt-6 sm:mt-10 px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Editor Container */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 flex flex-col lg:flex-row min-h-[65vh] overflow-hidden">

          {/* Left Panel - Input */}
          <div className="flex-1 flex flex-col relative group border-b lg:border-b-0 lg:border-r border-gray-200">
            
            {/* Input Header */}
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Original Document</span>
              {text && (
                <button 
                  onClick={() => setText("")}
                  className="text-xs font-semibold px-3 py-1.5 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  Clear text
                </button>
              )}
            </div>

            {/* Input Textarea */}
            <textarea
              className="flex-1 px-6 py-2 w-full resize-none border-none focus:ring-0 text-gray-800 text-lg leading-relaxed placeholder-gray-300 bg-transparent outline-none"
              placeholder="Paste or type your text here to rewrite..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            
            {/* Input Footer & Controls */}
            <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
              
              <div className="flex items-center gap-4">
                <div className="text-sm font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                  {wordCount} <span className="font-normal text-gray-400">words</span>
                </div>
                
                <select
                  className="text-sm bg-white border border-gray-200 text-gray-700 py-1.5 px-3 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold shadow-sm cursor-pointer hover:border-gray-300"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="Professional">Professional (Default)</option>
                  <option value="Casual">Casual</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Creative">Creative</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>
              
              <button
                onClick={handleRewrite}
                disabled={loading || !text}
                className={`px-8 py-3 rounded-xl text-sm font-bold text-white transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-lg ${
                  loading || !text
                    ? "bg-indigo-300 cursor-not-allowed shadow-none transform-none"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Rewriting...
                  </>
                ) : (
                  <>
                    Rewrite text
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="flex-1 flex flex-col bg-[#FAFAFA]">
            
            {/* Output Header */}
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Rewritten Output</span>
              
              {result && (
                <button
                  onClick={handleCopy}
                  className="text-sm font-semibold px-4 py-1.5 rounded-md bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm flex items-center gap-2"
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
            
            {/* Output Text Area */}
            <div className="flex-1 px-6 py-2 overflow-y-auto">
              {result ? (
                <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap outline-none pb-6">
                  {result}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 select-none pb-10 opacity-60">
                  <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  <p className="text-lg font-medium">Results will appear here</p>
                  <p className="text-sm mt-1">Enter text and click Rewrite to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}