"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [sliderValue, setSliderValue] = useState(2); 
  const [numRewrites, setNumRewrites] = useState(1); // নতুন ফিচার
  const [results, setResults] = useState([]); // Array of results
  const [activeTab, setActiveTab] = useState(0); 
  const [highlight, setHighlight] = useState(true); // Highlight toggle
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const getTone = (value) => {
    if (value == 1) return "Fluent";
    if (value == 2) return "Regular";
    if (value == 3) return "Creative";
    return "Regular";
  };

  const handleRewrite = async () => {
    if (!text) return;
    setLoading(true);
    setResults([]);
    setCopied(false);

    try {
      const res = await fetch("https://enl-rewriter-backend.onrender.com/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: text, 
          tone: getTone(sliderValue),
          num_rewrites: numRewrites 
        }),
      });

      const data = await res.json();
      if (data.error) {
        setResults([data.error]);
      } else if (data.rewrites && data.rewrites.length > 0) {
        setResults(data.rewrites);
        setActiveTab(0);
      } else {
        setResults(["No result found."]);
      }
    } catch (error) {
      setResults(["Something went wrong! Please check your connection."]);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (results[activeTab]) {
      navigator.clipboard.writeText(results[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // পরিবর্তিত শব্দ হাইলাইট করার ম্যাজিক ফাংশন
  const renderHighlightedText = (originalText, newText) => {
    if (!highlight || !originalText) return newText;
    
    const origWords = originalText.toLowerCase().match(/\b(\w+)\b/g) || [];
    const newWordsArray = newText.split(/(\s+)/); 

    return newWordsArray.map((word, i) => {
      if (word.trim() === "") return <span key={i}>{word}</span>;
      
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");
      // যদি নতুন শব্দটি অরিজিনাল টেক্সটে না থাকে, তবে সেটি সবুজ হবে
      if (cleanWord && !origWords.includes(cleanWord)) {
        return <span key={i} className="text-[#03d665] bg-[#e1fff7] font-medium px-[2px] rounded">{word}</span>;
      }
      return <span key={i}>{word}</span>;
    });
  };

  return (
    <div className="flex h-screen bg-[#fafbfe] text-[#585858] font-sans overflow-hidden selection:bg-[#03d665] selection:text-white">
      
      {/* Sidebar */}
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
          <a href="#" className="flex items-center px-6 py-[12px] hover:text-[#03d665] font-medium text-[15px] transition-colors">
            <span className="mr-3 text-lg opacity-60">🛡️</span> Avoid AI Detection
          </a>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-[75px] bg-white border-b border-[#f1f1f1] flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center lg:hidden">
             <div className="text-[22px] font-bold text-[#000000]">Word<span className="text-[#03d665]">Ai</span></div>
          </div>
          <div className="hidden lg:block"></div>
          <div className="w-[40px] h-[40px] rounded-full bg-[#007bff] text-white flex items-center justify-center font-bold shadow-sm cursor-pointer">S</div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#fafbfe]">
          <div className="max-w-[1400px] mx-auto bg-white rounded-[10px] shadow-[0_0_20px_0_rgba(0,0,0,0.05)] border border-[#f1f1f1] overflow-hidden">
            
            <div className="flex flex-col lg:flex-row min-h-[500px]">
              {/* Left Side: Input */}
              <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-[#f1f1f1] relative">
                <div className="px-6 py-3 flex justify-between bg-[#fafbfe] border-b border-[#f1f1f1]">
                  <span className="text-[13px] font-bold text-[#000000] uppercase">Original Article</span>
                  <button onClick={() => setText("")} className="text-[13px] font-medium hover:text-red-500">Clear</button>
                </div>
                <textarea
                  className="flex-1 p-6 w-full resize-none border-none outline-none bg-transparent"
                  style={{ fontSize: '14px', lineHeight: '1.8', letterSpacing: '1px' }}
                  placeholder="Enter your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="px-6 py-2 text-[12px] text-[#c2c2c2] font-medium border-t border-[#f1f1f1]">
                  Words: {wordCount}
                </div>
              </div>

              {/* Right Side: Output */}
              <div className="flex-1 flex flex-col relative bg-[#fafbfe]">
                
                {/* Tabs & Toolbar */}
                <div className="px-6 py-3 flex items-center justify-between border-b border-[#f1f1f1] bg-[#fafbfe]">
                  <div className="flex gap-4">
                    {results.length > 0 ? results.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`text-[13px] font-bold pb-1 border-b-2 transition-all ${activeTab === idx ? 'border-[#03d665] text-[#03d665]' : 'border-transparent text-[#c2c2c2] hover:text-[#585858]'}`}
                      >
                        Rewrite {idx + 1}
                      </button>
                    )) : (
                      <span className="text-[13px] font-bold text-[#03d665] uppercase">Rewritten Article</span>
                    )}
                  </div>
                  
                  {results.length > 0 && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setHighlight(!highlight)}
                        className={`text-[12px] font-medium px-2 py-1 rounded border transition-all ${highlight ? 'bg-[#e1fff7] text-[#03d665] border-[#03d665]' : 'bg-white text-[#585858] border-[#f1f1f1]'}`}
                      >
                        ✨ Highlights
                      </button>
                      <button onClick={handleCopy} className="text-[12px] font-medium px-2 py-1 bg-white border border-[#f1f1f1] rounded hover:text-[#03d665]">
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  {results.length > 0 ? (
                    <div className="whitespace-pre-wrap outline-none" style={{ fontSize: '14px', lineHeight: '1.8' }}>
                      {renderHighlightedText(text, results[activeTab])}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-[#c2c2c2] text-[14px]">
                      Your rewritten text will appear here.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Settings */}
            <div className="bg-white border-t border-[#f1f1f1] p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                
                {/* Num Rewrites Dropdown */}
                <div className="w-full md:w-[150px]">
                   <div className="mb-2 text-[14px] font-bold text-[#000000]">Number of rewrites:</div>
                   <select 
                      className="w-full text-[13px] bg-white border border-[#e1e1e1] rounded px-3 py-2 focus:outline-none cursor-pointer"
                      value={numRewrites}
                      onChange={(e) => setNumRewrites(parseInt(e.target.value))}
                   >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                   </select>
                </div>

                {/* Slider */}
                <div className="flex-1 w-full max-w-sm">
                   <div className="mb-2 text-[14px] font-bold text-[#000000]">Settings:</div>
                   <div className="flex justify-between text-[11px] text-[#585858] mb-2 font-medium">
                      <span className={sliderValue == 1 ? "text-[#03d665]" : ""}>More Conservative</span>
                      <span className={sliderValue == 2 ? "text-[#03d665]" : ""}>Regular</span>
                      <span className={sliderValue == 3 ? "text-[#03d665]" : ""}>More Adventurous</span>
                   </div>
                   <input 
                      type="range" min="1" max="3" step="1"
                      value={sliderValue}
                      onChange={(e) => setSliderValue(e.target.value)}
                      className="w-full h-2 bg-[#f1f1f1] rounded-lg appearance-none cursor-pointer outline-none"
                      style={{ background: `linear-gradient(to right, #03d665 ${(sliderValue - 1) * 50}%, #f1f1f1 ${(sliderValue - 1) * 50}%)`, accentColor: '#03d665' }}
                   />
                </div>

                {/* Button */}
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