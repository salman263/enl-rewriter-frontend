"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("Regular");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Word count calculation
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleRewrite = async () => {
    if (!text) return;
    setLoading(true);
    setResult("");

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
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="flex h-screen bg-[#fafbfe] text-[#585858] font-sans overflow-hidden selection:bg-[#03d665] selection:text-white">
      
      {/* Sidebar - Exact Layout */}
      <div className="w-[260px] bg-white border-r border-[#f1f1f1] flex flex-col shadow-sm z-20 hidden lg:flex">
        <div className="h-[75px] flex items-center px-6 border-b border-[#f1f1f1]">
          <div className="text-[26px] font-bold tracking-tight text-[#000000]">
            Word<span className="text-[#03d665]">Ai</span>
          </div>
        </div>
        
        <div className="py-4 flex-1">
          <a href="#" className="flex items-center px-6 py-[12px] bg-[#e1fff7] text-[#03d665] border-r-4 border-[#03d665] font-medium text-[15px]">
            <span className="mr-3 text-lg">✏️</span> Rewrite Articles
          </a>
          <a href="#" className="flex items-center px-6 py-[12px] text-[#585858] hover:text-[#03d665] font-medium text-[15px] transition-colors">
            <span className="mr-3 text-lg opacity-60">🛡️</span> Avoid AI Detection
          </a>
          <a href="#" className="flex items-center px-6 py-[12px] text-[#585858] hover:text-[#03d665] font-medium text-[15px] transition-colors">
            <span className="mr-3 text-lg opacity-60">📁</span> Saved Articles
          </a>
          <a href="#" className="flex items-center px-6 py-[12px] text-[#585858] hover:text-[#03d665] font-medium text-[15px] transition-colors">
            <span className="mr-3 text-lg opacity-60">⚙️</span> Bulk Rewrite
          </a>
          <a href="#" className="flex items-center px-6 py-[12px] text-[#585858] hover:text-[#03d665] font-medium text-[15px] transition-colors">
            <span className="mr-3 text-lg opacity-60">🔌</span> API
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-[75px] bg-white border-b border-[#f1f1f1] flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center lg:hidden">
             <div className="text-[22px] font-bold text-[#000000]">
              Word<span className="text-[#03d665]">Ai</span>
            </div>
          </div>
          <div className="hidden lg:block"></div>
          
          <div className="flex items-center cursor-pointer">
            <div className="w-[40px] h-[40px] rounded-full bg-[#007bff] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              S
            </div>
          </div>
        </header>

        {/* Editor Workspace */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#fafbfe]">
          <div className="max-w-[1400px] mx-auto bg-white rounded-[10px] shadow-[0_0_20px_0_rgba(0,0,0,0.05)] border border-[#f1f1f1] overflow-hidden">
            
            {/* Editor Top Toolbar (Froala Style) */}
            <div className="h-[50px] bg-white border-b border-[#f1f1f1] flex items-center px-4">
              <div className="flex items-center space-x-2 text-[#585858]">
                <button className="w-8 h-8 flex items-center justify-center hover:bg-[#fafbfe] rounded text-[16px] font-bold" title="Bold">B</button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-[#fafbfe] rounded text-[16px] italic" title="Italic">I</button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-[#fafbfe] rounded text-[16px] underline" title="Underline">U</button>
                <div className="w-px h-5 bg-[#c2c2c2] mx-2"></div>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-[#fafbfe] rounded text-[14px]" title="List">📝</button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row min-h-[500px]">
              
              {/* Left Side: Input */}
              <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-[#f1f1f1] relative">
                
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                   <button 
                    onClick={() => setText("")}
                    className="w-[35px] h-[35px] bg-white border border-[#f1f1f1] rounded-[7px] shadow-sm flex items-center justify-center hover:bg-[#fafbfe] text-gray-500 hover:text-red-500"
                    title="Clear"
                  >
                    ✖
                  </button>
                </div>

                <textarea
                  className="flex-1 p-6 w-full resize-none border-none outline-none bg-transparent"
                  style={{ fontSize: '14px', lineHeight: '1.8', letterSpacing: '1px', color: '#585858', fontFamily: '"Poppins", sans-serif' }}
                  placeholder="Enter your text here"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                
                {/* Word Count */}
                <div className="px-6 py-2 text-[12px] text-[#c2c2c2] font-medium border-t border-[#f1f1f1]">
                  Words: {wordCount}
                </div>
              </div>

              {/* Right Side: Output */}
              <div className="flex-1 flex flex-col relative bg-[#fafbfe]">
                
                 {result && (
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                    <button 
                      onClick={handleCopy}
                      className="w-[35px] h-[35px] bg-white border border-[#f1f1f1] rounded-[7px] shadow-sm flex items-center justify-center hover:bg-[#fafbfe] text-[#585858] hover:text-[#03d665]"
                      title="Copy to Clipboard"
                    >
                      📋
                    </button>
                  </div>
                )}

                <div className="flex-1 p-6 overflow-y-auto">
                  {result ? (
                    <div 
                      className="whitespace-pre-wrap outline-none" 
                      style={{ fontSize: '14px', lineHeight: '1.8', letterSpacing: '1px', color: '#585858', fontFamily: '"Poppins", sans-serif' }}
                    >
                      {result}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[#c2c2c2] select-none">
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Controls Area */}
            <div className="bg-white border-t border-[#f1f1f1] p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                
                <div className="flex-1 w-full max-w-md">
                   <div className="mb-2 text-[14px] font-bold text-[#000000]">Settings:</div>
                   <div className="flex items-center justify-between text-[12px] text-[#585858] mb-1">
                      <span>More Conservative</span>
                      <span>Regular</span>
                      <span>More Adventurous</span>
                   </div>
                   <select 
                      className="w-full h-[8px] bg-[#f1f1f1] rounded-lg appearance-none cursor-pointer outline-none border-none text-transparent"
                      style={{
                        background: tone === 'Fluent' ? 'linear-gradient(90deg, #03d665 0%, #f1f1f1 0%)' :
                                    tone === 'Regular' ? 'linear-gradient(90deg, #03d665 50%, #f1f1f1 50%)' :
                                    'linear-gradient(90deg, #03d665 100%, #f1f1f1 100%)'
                      }}
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                   >
                      <option value="Fluent">Conservative</option>
                      <option value="Regular">Regular</option>
                      <option value="Creative">Adventurous</option>
                   </select>
                </div>

                <div className="w-full md:w-auto text-right">
                  <button
                    onClick={handleRewrite}
                    disabled={loading || !text}
                    className={`w-full md:w-[150px] h-[50px] rounded-[7px] text-[16px] font-medium text-white transition-colors ${
                      loading || !text ? "opacity-50 cursor-not-allowed" : "hover:bg-[#02a64e]"
                    }`}
                    style={{ backgroundColor: '#03d665' }}
                  >
                    {loading ? "..." : "Rewrite"}
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}