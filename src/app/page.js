"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("Professional");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
    <div className="min-h-screen bg-[#f4f7f6] text-[#333333] font-sans selection:bg-[#ccf0f0]">
      
      {/* WordAi Exact Navbar */}
      <header className="bg-white border-b border-[#e5e9f0] h-16 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-10">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="bg-[#1bb3b6] text-white font-black text-xl w-9 h-9 flex items-center justify-center rounded shadow-sm">
            W
          </div>
          <span className="text-[22px] font-bold tracking-tight text-[#333333]">
            Word<span className="text-[#1bb3b6]">Ai</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#5c6b7a]">
          <a href="#" className="text-[#1bb3b6] border-b-2 border-[#1bb3b6] py-5">Rewrite Articles</a>
          <a href="#" className="hover:text-[#1bb3b6] transition-colors py-5">Saved Articles</a>
          <a href="#" className="hover:text-[#1bb3b6] transition-colors py-5">API</a>
          <div className="ml-4 w-9 h-9 rounded-full bg-[#1bb3b6] flex items-center justify-center text-white font-bold cursor-pointer hover:bg-[#159a9c] transition-colors shadow-sm">
            M
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-[1400px] mx-auto mt-6 sm:mt-10 px-4 sm:px-6 lg:px-8 pb-16">
        
        <div className="bg-white rounded-lg shadow-sm border border-[#e5e9f0] flex flex-col lg:flex-row min-h-[65vh] overflow-hidden">

          {/* Left Panel - Input */}
          <div className="flex-1 flex flex-col relative group border-b lg:border-b-0 lg:border-r border-[#e5e9f0]">
            
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#e5e9f0] bg-[#fdfdfe]">
              <span className="text-[13px] font-bold text-[#7a8b9a] uppercase tracking-wider">Original Content</span>
              {text && (
                <button 
                  onClick={() => setText("")}
                  className="text-xs font-semibold px-3 py-1.5 rounded text-[#7a8b9a] hover:bg-[#ffeaea] hover:text-[#ff4d4f] transition-all"
                >
                  Clear text
                </button>
              )}
            </div>

            <textarea
              className="flex-1 px-6 py-4 w-full resize-none border-none focus:ring-0 text-[#333333] text-[16px] leading-relaxed placeholder-[#a1b0bd] bg-transparent outline-none"
              placeholder="Paste your content here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            
            <div className="px-6 py-4 bg-[#fdfdfe] border-t border-[#e5e9f0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
              
              <div className="flex items-center gap-4">
                <div className="text-[14px] font-medium text-[#7a8b9a]">
                  <span className={wordCount > 0 ? "text-[#1bb3b6] font-bold" : ""}>{wordCount}</span> words
                </div>
                
                <div className="h-4 w-px bg-[#e5e9f0]"></div>
                
                <select
                  className="text-[14px] bg-transparent border-none text-[#333333] font-medium py-1 focus:outline-none focus:ring-0 cursor-pointer hover:text-[#1bb3b6]"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="Professional">Regular</option>
                  <option value="Casual">More Casual</option>
                  <option value="Fluent">More Conservative</option>
                  <option value="Creative">More Adventurous</option>
                </select>
              </div>
              
              <button
                onClick={handleRewrite}
                disabled={loading || !text}
                className={`px-8 py-2.5 rounded text-[15px] font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  loading || !text
                    ? "bg-[#a1d9da] cursor-not-allowed"
                    : "bg-[#1bb3b6] hover:bg-[#159a9c]"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </>
                ) : (
                  "Rewrite"
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="flex-1 flex flex-col bg-white">
            
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#e5e9f0] bg-[#fdfdfe]">
              <span className="text-[13px] font-bold text-[#1bb3b6] uppercase tracking-wider">Rewritten Content</span>
              
              {result && (
                <button
                  onClick={handleCopy}
                  className="text-[13px] font-semibold px-3 py-1.5 rounded border border-[#e5e9f0] text-[#5c6b7a] hover:text-[#1bb3b6] hover:border-[#1bb3b6] transition-all flex items-center gap-1.5"
                >
                  {copied ? (
                    <span className="text-[#1bb3b6] flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      Copy
                    </span>
                  )}
                </button>
              )}
            </div>
            
            <div className="flex-1 px-6 py-4 overflow-y-auto">
              {result ? (
                <div className="text-[#333333] text-[16px] leading-relaxed whitespace-pre-wrap outline-none pb-6">
                  {result}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[#a1b0bd] select-none pb-10">
                  <p className="text-[15px]">Your rewritten text will appear here.</p>
                </div>
              )}
            </div>
            
            {/* Empty footer area to match the left side structure height */}
            <div className="px-6 py-5 bg-[#fdfdfe] border-t border-[#e5e9f0] min-h-[73px]"></div>
          </div>
        </div>
      </main>
    </div>
  );
}