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
    <div className="min-h-screen bg-[#f2f5f7] text-[#333333] font-sans">
      
      {/* WordAi Style Header */}
      <header className="bg-white border-b border-[#e5e9f0] py-3 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-1 cursor-pointer">
          <span className="text-2xl font-bold text-[#333333]">Word</span>
          <span className="text-2xl font-bold text-[#1bb3b6]">Ai</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-[#5c6b7a]">
          <span className="hover:text-[#1bb3b6] cursor-pointer transition-colors">Rewrite</span>
          <span className="hover:text-[#1bb3b6] cursor-pointer transition-colors">Avoid AI Detection</span>
          <div className="w-8 h-8 rounded-full bg-[#1bb3b6] text-white flex items-center justify-center font-bold">
            U
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 pb-12">
        <div className="bg-white rounded-lg shadow-sm border border-[#e5e9f0] overflow-hidden flex flex-col lg:flex-row min-h-[600px]">

          {/* Left Pane - Input */}
          <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-[#e5e9f0]">
            
            {/* Input Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#e5e9f0]">
              <h2 className="text-[#333333] font-semibold text-[15px]">Enter text to rewrite</h2>
              <button 
                onClick={() => setText("")}
                className="text-sm font-medium text-[#7a8b9a] hover:text-[#ff4d4f] transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Input Textarea */}
            <textarea
              className="flex-1 p-6 w-full resize-none border-none focus:ring-0 text-[#333333] text-[16px] leading-relaxed placeholder-[#a1b0bd] outline-none"
              placeholder="Paste or type your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            
            {/* Input Footer & Controls */}
            <div className="px-6 py-4 bg-[#f9fafc] border-t border-[#e5e9f0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-[#7a8b9a] font-medium">
                  <span className={wordCount > 0 ? "text-[#1bb3b6]" : ""}>{wordCount}</span> words
                </div>
                <div className="h-4 w-px bg-[#d1d9e2] hidden sm:block"></div>
                <select
                  className="text-sm bg-transparent border-none text-[#333333] font-semibold focus:ring-0 cursor-pointer outline-none hover:text-[#1bb3b6]"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="Professional">Regular</option>
                  <option value="Casual">More Casual</option>
                  <option value="Fluent">More Conservative</option>
                  <option value="Creative">More Adventurous</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>
              
              <button
                onClick={handleRewrite}
                disabled={loading || !text}
                className={`px-8 py-2.5 rounded text-[15px] font-bold text-white transition-colors flex items-center justify-center gap-2 ${
                  loading || !text
                    ? "bg-[#a1d9da] cursor-not-allowed"
                    : "bg-[#1bb3b6] hover:bg-[#159a9c]"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Rewriting...
                  </>
                ) : (
                  "Rewrite"
                )}
              </button>
            </div>
          </div>

          {/* Right Pane - Output */}
          <div className="flex-1 flex flex-col bg-white">
            
            {/* Output Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#e5e9f0] bg-[#f9fafc]">
              <h2 className="text-[#333333] font-semibold text-[15px]">Rewritten text</h2>
              {result && (
                <button
                  onClick={handleCopy}
                  className="text-sm font-medium text-[#1bb3b6] hover:text-[#159a9c] flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Copied
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
            <div className="flex-1 p-6 overflow-y-auto">
              {result ? (
                <div className="text-[#333333] text-[16px] leading-relaxed whitespace-pre-wrap outline-none">
                  {result}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[#a1b0bd] select-none">
                  <p className="text-[15px]">Your rewritten text will appear here.</p>
                </div>
              )}
            </div>
            
            {/* Empty Footer just to match height structure if needed */}
            <div className="px-6 py-4 bg-white border-t border-[#e5e9f0] min-h-[73px]"></div>
          </div>

        </div>
      </main>
    </div>
  );
}