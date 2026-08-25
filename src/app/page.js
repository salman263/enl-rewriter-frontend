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
    <div className="min-h-screen font-sans selection:bg-[#ccf0f0]" style={{ backgroundColor: '#fafbfe', color: '#585858', fontFamily: '"Poppins", sans-serif' }}>
      
      {/* WordAi Navbar */}
      <header className="bg-white border-b border-[#f1f1f1] h-[70px] flex items-center justify-between px-6 sm:px-10 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="text-white font-bold text-xl w-9 h-9 flex items-center justify-center rounded" style={{ backgroundColor: '#1bb3b6' }}>
            W
          </div>
          <span className="text-[22px] font-bold tracking-tight" style={{ color: '#000000' }}>
            Word<span style={{ color: '#1bb3b6' }}>Ai</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[14px] font-medium" style={{ color: '#585858' }}>
          <a href="#" className="border-b-2 py-[23px]" style={{ color: '#1bb3b6', borderColor: '#1bb3b6' }}>Rewrite Articles</a>
          <a href="#" className="hover:text-[#1bb3b6] transition-colors py-[23px]">Saved Articles</a>
          <a href="#" className="hover:text-[#1bb3b6] transition-colors py-[23px]">API</a>
          <div className="ml-4 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition-colors shadow-sm" style={{ backgroundColor: '#1bb3b6' }}>
            M
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-[1400px] mx-auto mt-8 px-4 sm:px-8 pb-16">
        
        <div className="bg-white rounded shadow-sm border border-[#f1f1f1] flex flex-col lg:flex-row min-h-[600px] overflow-hidden">

          {/* Left Panel - Input */}
          <div className="flex-1 flex flex-col relative group border-b lg:border-b-0 lg:border-r border-[#f1f1f1]">
            
            <div className="px-6 py-3 flex items-center justify-between border-b border-[#f1f1f1] bg-[#fafbfe]">
              <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: '#000000' }}>Original Article</span>
              {text && (
                <button 
                  onClick={() => setText("")}
                  className="text-[13px] font-medium px-3 py-1 rounded transition-all" style={{ color: '#585858' }}
                >
                  Clear text
                </button>
              )}
            </div>

            <textarea
              className="flex-1 px-6 py-4 w-full resize-none border-none focus:ring-0 outline-none bg-transparent"
              style={{ fontSize: '14px', lineHeight: '1.8', letterSpacing: '1px', color: '#585858' }}
              placeholder="Enter your text here"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            
            <div className="px-6 py-4 bg-[#fafbfe] border-t border-[#f1f1f1] flex flex-col xl:flex-row xl:items-center justify-between gap-4 mt-auto">
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-[13px] font-medium" style={{ color: '#585858' }}>
                  <span className="font-bold" style={{ color: wordCount > 0 ? '#1bb3b6' : '#585858' }}>{wordCount}</span> words
                </div>
                
                <div className="h-4 w-px bg-[#c2c2c2] hidden sm:block"></div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[13px] hidden sm:block" style={{ color: '#585858' }}>Tone:</span>
                  <select
                    className="text-[13px] bg-transparent border border-[#e1e1e1] rounded px-2 py-1 focus:outline-none cursor-pointer"
                    style={{ color: '#000000' }}
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <option value="Professional">Regular</option>
                    <option value="Casual">More Casual</option>
                    <option value="Fluent">More Conservative</option>
                    <option value="Creative">More Adventurous</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={handleRewrite}
                disabled={loading || !text}
                className={`px-8 py-2 rounded text-[14px] font-medium text-white transition-all flex items-center justify-center gap-2 ${
                  loading || !text
                    ? "cursor-not-allowed opacity-50"
                    : "hover:opacity-90"
                }`}
                style={{ backgroundColor: '#1bb3b6' }}
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
            
            <div className="px-6 py-3 flex items-center justify-between border-b border-[#f1f1f1] bg-[#fafbfe]">
              <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: '#1bb3b6' }}>Rewritten Article</span>
              
              {result && (
                <button
                  onClick={handleCopy}
                  className="text-[13px] font-medium px-3 py-1 rounded border transition-all flex items-center gap-1.5"
                  style={{ color: '#585858', borderColor: '#f1f1f1', backgroundColor: '#ffffff' }}
                >
                  {copied ? (
                    <span className="flex items-center gap-1" style={{ color: '#1bb3b6' }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 hover:text-[#1bb3b6]">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      Copy
                    </span>
                  )}
                </button>
              )}
            </div>
            
            <div className="flex-1 px-6 py-4 overflow-y-auto">
              {result ? (
                <div className="whitespace-pre-wrap outline-none pb-6" style={{ fontSize: '14px', lineHeight: '1.8', letterSpacing: '1px', color: '#585858' }}>
                  {result}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center select-none pb-10" style={{ color: '#c2c2c2' }}>
                  <p className="text-[14px]">Your rewritten text will appear here.</p>
                </div>
              )}
            </div>
            
            {/* Empty footer area to match the left side structure height */}
            <div className="px-6 py-4 bg-[#fafbfe] border-t border-[#f1f1f1] min-h-[65px]"></div>
          </div>
        </div>
      </main>
    </div>
  );
}