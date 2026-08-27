"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { isLoaded, user } = useUser(); 
  const router = useRouter(); 

  const [text, setText] = useState("");
  const [sliderValue, setSliderValue] = useState(2); 
  const [numRewrites, setNumRewrites] = useState(1); 
  const [results, setResults] = useState([]); 
  const [activeTab, setActiveTab] = useState(0); 
  const [highlight, setHighlight] = useState(true); 
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState("rewrite"); 
  
  // 🚀 সঠিক লিমিট স্টেট (creditsLeft বাদ দিয়ে আলাদা করা হয়েছে)
  const [seoWords, setSeoWords] = useState("...");
  const [bypassWords, setBypassWords] = useState("...");

  // 🎁 AppSumo Coupon States
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [redeemLoading, setRedeemLoading] = useState(false);

  const fetchUserLimits = () => {
    if (user) {
      fetch(`https://enl-rewriter-backend.onrender.com/api/user/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setSeoWords(data.seo_words !== undefined ? data.seo_words.toLocaleString() : "...");
            setBypassWords(data.bypass_words !== undefined ? data.bypass_words.toLocaleString() : "...");
          }
        })
        .catch((err) => console.error("Failed to fetch limits"));
    }
  };

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    } else if (isLoaded && user) {
      // ইমেইল সিঙ্ক
      fetch("https://enl-rewriter-backend.onrender.com/api/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.primaryEmailAddress?.emailAddress })
      });
      // লিমিট ফেচ
      fetchUserLimits();
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafbfe]">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#03d665]"></div>
      </div>
    );
  }

  const userId = user.id;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const getTone = (value) => {
    if (mode === "rewrite") {
      if (value == 1) return "Fluent";
      if (value == 2) return "Regular";
      if (value == 3) return "Creative";
    } else {
      if (value == 1) return "Basic Bypass";
      if (value == 2) return "Advanced Bypass";
      if (value == 3) return "Maximum Humanization";
    }
    return "Regular";
  };

  const handleRewrite = async () => {
    if (!text.trim()) return alert("Please enter some text.");
    
    // লিমিট চেক
    const requiredLimitStr = mode === "rewrite" ? seoWords : bypassWords;
    const requiredLimit = parseInt(String(requiredLimitStr).replace(/,/g, ''));
    
    if (requiredLimit < wordCount) {
      return alert(`Limit Reached! You have ${requiredLimitStr} words left for ${mode === "rewrite" ? "SEO Rewrite" : "AI Bypass"}.`);
    }

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
          num_rewrites: numRewrites,
          mode: mode,
          userId: userId
        }),
      });

      const data = await res.json();
      
      if (data.error) {
        setResults([data.error]);
      } else if (data.rewrites && data.rewrites.length > 0) {
        setResults(data.rewrites);
        setActiveTab(0);
        
        // ব্যালেন্স আপডেট
        if (data.words_left !== undefined) {
          if (mode === "rewrite") setSeoWords(data.words_left.toLocaleString());
          else setBypassWords(data.words_left.toLocaleString());
        }
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

  // 🎁 Redeem Coupon Function
  const handleRedeem = async () => {
    if (!couponCode.trim()) return alert("Please enter a valid code");
    setRedeemLoading(true);
    try {
      const res = await fetch("https://enl-rewriter-backend.onrender.com/api/redeem-coupon", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, code: couponCode.trim().toUpperCase() })
      });
      const data = await res.json();
      if (data.success) {
        alert("🎉 Coupon Redeemed Successfully! Your plan has been upgraded.");
        setShowCouponModal(false);
        setCouponCode("");
        fetchUserLimits(); // নতুন লিমিট লোড করবে
      } else {
        alert(data.error || "Invalid or used coupon code.");
      }
    } catch (err) {
      alert("Failed to redeem coupon.");
    }
    setRedeemLoading(false);
  };

  const renderHighlightedText = (originalText, newText) => {
    if (!highlight || !originalText) return newText;
    const origWords = originalText.toLowerCase().match(/\b(\w+)\b/g) || [];
    const newWordsArray = newText.split(/(\s+)/); 

    return newWordsArray.map((word, i) => {
      if (word.trim() === "") return <span key={i}>{word}</span>;
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");
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
          <div className="text-[26px] font-bold tracking-tight text-[#000000] cursor-pointer" onClick={() => router.push("/")}>
            ZeroWord<span className="text-[#03d665]">Ai</span>
          </div>
        </div>
        <div className="py-4 flex-1">
          <button 
            onClick={() => setMode("rewrite")}
            className={`w-full flex items-center px-6 py-[12px] font-medium text-[15px] transition-colors ${mode === "rewrite" ? "bg-[#e1fff7] text-[#03d665] border-r-4 border-[#03d665]" : "text-[#585858] hover:text-[#03d665]"}`}
          >
            <span className="mr-3 text-lg">✏️</span> Rewrite Articles
          </button>
          <button 
            onClick={() => setMode("avoid_ai")}
            className={`w-full flex items-center px-6 py-[12px] font-medium text-[15px] transition-colors ${mode === "avoid_ai" ? "bg-[#e1fff7] text-[#03d665] border-r-4 border-[#03d665]" : "text-[#585858] hover:text-[#03d665]"}`}
          >
            <span className="mr-3 text-lg">🛡️</span> Avoid AI Detection
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Dashboard Header */}
        <header className="h-[75px] bg-white border-b border-[#f1f1f1] flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center lg:hidden">
             <div className="text-[22px] font-bold text-[#000000]">ZeroWord<span className="text-[#03d665]">Ai</span></div>
          </div>
          <div className="hidden lg:block text-[#000000] font-bold text-lg">
            {mode === "rewrite" ? "Semantic SEO Rewriter" : "AI Detection Humanizer"}
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* 🚀 Dynamic Word Limits Display */}
            <div className="hidden md:flex items-center bg-[#fafbfe] border border-[#f1f1f1] px-4 py-1.5 rounded-full text-[12px] font-bold text-[#585858]">
              {mode === "rewrite" ? (
                <>SEO Words: <span className="text-blue-500 ml-1.5">{seoWords}</span></>
              ) : (
                <>Bypass Words: <span className="text-[#03d665] ml-1.5">{bypassWords}</span></>
              )}
            </div>

            {/* 🎁 Redeem AppSumo Code Button */}
            <button onClick={() => setShowCouponModal(true)} className="text-xs font-bold bg-[#e1fff7] text-[#03d665] px-3 py-1.5 rounded-full hover:bg-[#03d665] hover:text-white transition">
              🎁 Redeem Code
            </button>

            <button onClick={() => router.push("/pricing")} className="hidden sm:block text-xs font-bold text-[#000] hover:text-[#03d665]">Upgrade</button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#fafbfe]">
          <div className="max-w-[1400px] mx-auto bg-white rounded-[10px] shadow-[0_0_20px_0_rgba(0,0,0,0.05)] border border-[#f1f1f1] overflow-hidden">
            
            <div className="flex flex-col lg:flex-row min-h-[500px]">
              {/* Input Area */}
              <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-[#f1f1f1] relative">
                <div className="px-6 py-3 flex justify-between bg-[#fafbfe] border-b border-[#f1f1f1]">
                  <span className="text-[13px] font-bold text-[#000000] uppercase">Original Content</span>
                  <button onClick={() => setText("")} className="text-[13px] font-medium hover:text-red-500">Clear</button>
                </div>
                <textarea
                  className="flex-1 p-6 w-full resize-none border-none outline-none bg-transparent"
                  style={{ fontSize: '14px', lineHeight: '1.8', letterSpacing: '1px' }}
                  placeholder={mode === "rewrite" ? "Enter your text to rewrite..." : "Paste AI text here to bypass detection..."}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="px-6 py-2 text-[12px] text-[#c2c2c2] font-medium border-t border-[#f1f1f1]">Words: {wordCount}</div>
              </div>

              {/* Output Area */}
              <div className="flex-1 flex flex-col relative bg-[#fafbfe]">
                <div className="px-6 py-3 flex items-center justify-between border-b border-[#f1f1f1] bg-[#fafbfe]">
                  <div className="flex gap-4">
                    {results.length > 0 ? results.map((_, idx) => (
                      <button 
                        key={idx} onClick={() => setActiveTab(idx)}
                        className={`text-[13px] font-bold pb-1 border-b-2 transition-all ${activeTab === idx ? 'border-[#03d665] text-[#03d665]' : 'border-transparent text-[#c2c2c2] hover:text-[#585858]'}`}
                      >
                        Version {idx + 1}
                      </button>
                    )) : (
                      <span className="text-[13px] font-bold text-[#03d665] uppercase">
                        {mode === "rewrite" ? "Rewritten Content" : "Humanized Content"}
                      </span>
                    )}
                  </div>
                  
                  {results.length > 0 && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setHighlight(!highlight)}
                        className={`text-[12px] font-medium px-2 py-1 rounded border transition-all ${highlight ? 'bg-[#e1fff7] text-[#03d665] border-[#03d665]' : 'bg-white text-[#585858] border-[#f1f1f1]'}`}
                      >✨ Highlights</button>
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
                      Your {mode === "rewrite" ? "rewritten" : "humanized"} text will appear here.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic Bottom Settings */}
            <div className="bg-white border-t border-[#f1f1f1] p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                
                <div className="w-full md:w-[150px]">
                   <div className="mb-2 text-[14px] font-bold text-[#000000]">Variations:</div>
                   <select 
                      className="w-full text-[13px] bg-white border border-[#e1e1e1] rounded px-3 py-2 focus:outline-none cursor-pointer"
                      value={numRewrites}
                      onChange={(e) => setNumRewrites(parseInt(e.target.value))}
                   >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                   </select>
                </div>

                <div className="flex-1 w-full max-w-sm">
                   <div className="mb-2 text-[14px] font-bold text-[#000000]">
                     {mode === "rewrite" ? "Tone Settings:" : "Bypass Strength:"}
                   </div>
                   <div className="flex justify-between text-[11px] text-[#585858] mb-2 font-medium">
                      <span className={sliderValue == 1 ? "text-[#03d665]" : ""}>
                        {mode === "rewrite" ? "Conservative" : "Basic Bypass"}
                      </span>
                      <span className={sliderValue == 2 ? "text-[#03d665]" : ""}>
                        {mode === "rewrite" ? "Regular" : "Advanced"}
                      </span>
                      <span className={sliderValue == 3 ? "text-[#03d665]" : ""}>
                        {mode === "rewrite" ? "Adventurous" : "Max Human"}
                      </span>
                   </div>
                   <input 
                      type="range" min="1" max="3" step="1"
                      value={sliderValue}
                      onChange={(e) => setSliderValue(e.target.value)}
                      className="w-full h-2 bg-[#f1f1f1] rounded-lg appearance-none cursor-pointer outline-none"
                      style={{ background: `linear-gradient(to right, #03d665 ${(sliderValue - 1) * 50}%, #f1f1f1 ${(sliderValue - 1) * 50}%)`, accentColor: '#03d665' }}
                   />
                </div>

                <div className="w-full md:w-auto text-right">
                  <button
                    onClick={handleRewrite}
                    disabled={loading || !text}
                    className={`w-full md:w-[160px] h-[50px] rounded-[7px] text-[16px] font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                      loading || !text ? "opacity-50 cursor-not-allowed" : "hover:bg-[#02a64e]"
                    }`}
                    style={{ backgroundColor: '#03d665' }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...</span>
                    ) : (
                      mode === "rewrite" ? "Rewrite" : "Humanize Text"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🎁 AppSumo Redeem Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative">
            <button onClick={() => setShowCouponModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-xl">&times;</button>
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🎁</div>
              <h2 className="text-xl font-extrabold text-black">Redeem Promo Code</h2>
              <p className="text-sm text-gray-500 mt-1">Enter your AppSumo or promotional code to unlock premium features.</p>
            </div>
            <input 
              type="text" 
              placeholder="e.g. SUMO-A1B2C3D4" 
              className="w-full border-2 border-gray-200 focus:border-[#03d665] p-3 rounded-xl outline-none font-mono font-bold text-center text-lg text-black mb-4 uppercase"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button 
              onClick={handleRedeem}
              disabled={redeemLoading || !couponCode}
              className="w-full py-3 bg-[#03d665] text-white rounded-xl font-bold text-lg shadow-lg hover:bg-[#02a64e] disabled:opacity-50 transition"
            >
              {redeemLoading ? "Verifying..." : "Redeem Now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}