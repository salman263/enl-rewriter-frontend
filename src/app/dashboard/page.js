"use client";

import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// 🚀 WordAi-এর মত Premium Toolbar লোড করা হচ্ছে
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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
  const [seoWords, setSeoWords] = useState("...");
  const [bypassWords, setBypassWords] = useState("...");
  const [planName, setPlanName] = useState("...");
  
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [redeemLoading, setRedeemLoading] = useState(false);

  const [savedArticles, setSavedArticles] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [viewArticle, setViewArticle] = useState(null); 

  // 🚀 ടoolbar Options (Like Screenshot)
  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'bullet' }, { 'list': 'ordered' }],
      ['code-block']
    ]
  };

  // 🚀 HTML Stripper (To calculate real words & send plain text to AI)
  const stripHtml = (html) => {
    if (typeof window === "undefined") return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const plainText = stripHtml(text);
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;

  const fetchUserLimits = () => {
    if (user) {
      fetch(`https://enl-rewriter-backend.onrender.com/api/user/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setSeoWords(data.seo_words !== undefined ? data.seo_words.toLocaleString() : "...");
            setBypassWords(data.bypass_words !== undefined ? data.bypass_words.toLocaleString() : "...");
            setPlanName(data.plan || "Free");
          }
        })
        .catch((err) => console.error("Failed to fetch limits"));
    }
  };

  const fetchSavedArticles = async () => {
    if (!user) return;
    setLoadingSaved(true);
    try {
      const res = await fetch(`https://enl-rewriter-backend.onrender.com/api/saved-articles/${user.id}`);
      const data = await res.json();
      setSavedArticles(data.articles || []);
    } catch (err) { console.error("Error fetching saved articles"); }
    setLoadingSaved(false);
  };

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    } else if (isLoaded && user) {
      fetch("https://enl-rewriter-backend.onrender.com/api/sync-user", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.primaryEmailAddress?.emailAddress })
      });
      fetchUserLimits();
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (mode === "saved") fetchSavedArticles();
  }, [mode]);

  // 🚀 FIX: Clear text when switching modes
  const handleModeChange = (newMode) => {
    if (newMode !== mode) {
      setText("");
      setResults([]);
      setActiveTab(0);
      setCopied(false);
      setViewArticle(null);
    }
    setMode(newMode);
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafbfe]">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#03d665]"></div>
      </div>
    );
  }

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
    if (!plainText.trim()) return alert("Please enter some text.");
    
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
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: plainText, tone: getTone(sliderValue), num_rewrites: numRewrites, mode: mode, userId: user.id }),
      });

      const data = await res.json();
      
      if (data.error) {
        setResults([data.error]);
      } else if (data.rewrites && data.rewrites.length > 0) {
        setResults(data.rewrites);
        setActiveTab(0);
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

  const handleSaveCurrentArticle = async () => {
    if (!results[activeTab]) return;
    try {
      const res = await fetch("https://enl-rewriter-backend.onrender.com/api/saved-articles", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, original_text: plainText, rewritten_text: results[activeTab], mode: mode })
      });
      const data = await res.json();
      if(data.success) alert("Article saved to your dashboard!");
      else alert("Failed to save article.");
    } catch(err) { alert("Network error."); }
  };

  const handleDeleteSavedArticle = async (articleId) => {
    if(!window.confirm("Delete this saved article?")) return;
    try {
      await fetch(`https://enl-rewriter-backend.onrender.com/api/saved-articles/${articleId}`, { method: "DELETE" });
      setSavedArticles(prev => prev.filter(a => a.articleId !== articleId));
      if(viewArticle && viewArticle.articleId === articleId) setViewArticle(null);
    } catch(err) { alert("Failed to delete."); }
  };

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
        fetchUserLimits();
      } else {
        alert(data.error || "Invalid or used coupon code.");
      }
    } catch (err) { alert("Failed to redeem coupon."); }
    setRedeemLoading(false);
  };

  // 🚀 Output Highlighter for Quill
  const getHighlightedHtml = (originalHtml, newText) => {
    if (!highlight || !originalHtml) return newText;
    const originalText = stripHtml(originalHtml);
    const origWords = originalText.toLowerCase().match(/\b(\w+)\b/g) || [];
    const newWordsArray = newText.split(/(\s+)/); 

    const htmlArray = newWordsArray.map((word) => {
      if (word.trim() === "") return word;
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");
      if (cleanWord && !origWords.includes(cleanWord)) {
        return `<span style="background-color: #e1fff7; color: #03d665; font-weight: 500; padding: 0 3px; border-radius: 4px;">${word}</span>`;
      }
      return word;
    });
    return htmlArray.join('');
  };

  const sidebarMenus = [
    { id: "rewrite", icon: "✏️", label: "Rewrite Articles" },
    { id: "avoid_ai", icon: "🛡️", label: "Avoid AI Detection" },
    { id: "saved", icon: "💾", label: "Saved Articles" },
    { id: "bulk", icon: "📚", label: "Bulk Rewrite" },
    { id: "api", icon: "⚙️", label: "API" },
    { id: "settings", icon: "🛠️", label: "Rewrite Settings" },
    { id: "usage", icon: "📊", label: "Usage Info" },
    { id: "affiliate", icon: "🤝", label: "Affiliate" },
    { id: "billing", icon: "💳", label: "Billing" },
    { id: "support", icon: "🎧", label: "Support" },
  ];

  const renderContent = () => {
    if (mode === "rewrite" || mode === "avoid_ai") {
      return (
        <div className="max-w-[1400px] mx-auto bg-white rounded-[10px] shadow-[0_0_20px_0_rgba(0,0,0,0.05)] border border-[#f1f1f1] overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[500px]">
            
            {/* Input Area (With Quill) */}
            <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-[#f1f1f1] relative quill-wrapper">
              <div className="px-6 py-3 flex justify-between bg-[#fafbfe] border-b border-[#f1f1f1]">
                <span className="text-[13px] font-bold text-[#000000] uppercase">Original Content</span>
                <button onClick={() => setText("")} className="text-[13px] font-medium hover:text-red-500">Clear</button>
              </div>
              <ReactQuill
                theme="snow"
                value={text}
                onChange={setText}
                modules={quillModules}
                placeholder={mode === "rewrite" ? "Enter your text to rewrite..." : "Paste AI text here to bypass detection..."}
                className="flex-1 w-full bg-white"
              />
              <div className="px-6 py-2 text-[12px] text-[#c2c2c2] font-medium border-t border-[#f1f1f1] bg-white">Words: {wordCount}</div>
            </div>

            {/* Output Area (With Quill) */}
            <div className="flex-1 flex flex-col relative bg-[#fafbfe] quill-wrapper">
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
                    <button onClick={() => setHighlight(!highlight)} className={`text-[12px] font-medium px-2 py-1 rounded border transition-all ${highlight ? 'bg-[#e1fff7] text-[#03d665] border-[#03d665]' : 'bg-white text-[#585858] border-[#f1f1f1]'}`}>✨ Highlights</button>
                    <button onClick={handleSaveCurrentArticle} className="text-[12px] font-medium px-2 py-1 bg-white border border-[#f1f1f1] rounded hover:text-blue-500">💾 Save</button>
                    <button onClick={handleCopy} className="text-[12px] font-medium px-2 py-1 bg-white border border-[#f1f1f1] rounded hover:text-[#03d665]">{copied ? "Copied!" : "Copy"}</button>
                  </div>
                )}
              </div>

              <ReactQuill
                theme="snow"
                value={results.length > 0 ? getHighlightedHtml(text, results[activeTab]) : ""}
                readOnly={true}
                modules={quillModules}
                placeholder={mode === "rewrite" ? "Your rewritten text will appear here." : "Your humanized text will appear here."}
                className="flex-1 w-full bg-white output-quill"
              />
            </div>
          </div>

          {/* Dynamic Bottom Settings */}
          <div className="bg-white border-t border-[#f1f1f1] p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="w-full md:w-[150px]">
                 <div className="mb-2 text-[14px] font-bold text-[#000000]">Variations:</div>
                 <select 
                    className="w-full text-[13px] bg-white border border-[#e1e1e1] rounded px-3 py-2 focus:outline-none cursor-pointer"
                    value={numRewrites} onChange={(e) => setNumRewrites(parseInt(e.target.value))}
                 >
                    <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option>
                 </select>
              </div>

              <div className="flex-1 w-full max-w-sm">
                 <div className="mb-2 text-[14px] font-bold text-[#000000]">
                   {mode === "rewrite" ? "Tone Settings:" : "Bypass Strength:"}
                 </div>
                 <div className="flex justify-between text-[11px] text-[#585858] mb-2 font-medium">
                    <span className={sliderValue == 1 ? "text-[#03d665]" : ""}>{mode === "rewrite" ? "Conservative" : "Basic Bypass"}</span>
                    <span className={sliderValue == 2 ? "text-[#03d665]" : ""}>{mode === "rewrite" ? "Regular" : "Advanced"}</span>
                    <span className={sliderValue == 3 ? "text-[#03d665]" : ""}>{mode === "rewrite" ? "Adventurous" : "Max Human"}</span>
                 </div>
                 <input 
                    type="range" min="1" max="3" step="1" value={sliderValue} onChange={(e) => setSliderValue(e.target.value)}
                    className="w-full h-2 bg-[#f1f1f1] rounded-lg appearance-none cursor-pointer outline-none"
                    style={{ background: `linear-gradient(to right, #03d665 ${(sliderValue - 1) * 50}%, #f1f1f1 ${(sliderValue - 1) * 50}%)`, accentColor: '#03d665' }}
                 />
              </div>

              <div className="w-full md:w-auto text-right">
                <button
                  onClick={handleRewrite} disabled={loading || !plainText}
                  className={`w-full md:w-[160px] h-[50px] rounded-[7px] text-[16px] font-medium text-white transition-colors flex items-center justify-center gap-2 ${loading || !plainText ? "opacity-50 cursor-not-allowed" : "hover:bg-[#02a64e]"}`}
                  style={{ backgroundColor: '#03d665' }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...</span>
                  ) : ( mode === "rewrite" ? "Rewrite" : "Humanize Text" )}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // 💾 SAVED ARTICLES UI
    if (mode === "saved") {
      if(viewArticle) {
        return (
          <div className="max-w-[1200px] mx-auto bg-white rounded-xl shadow-sm border border-[#f1f1f1] p-8">
            <button onClick={() => setViewArticle(null)} className="mb-4 text-sm font-bold text-gray-500 hover:text-black">&larr; Back to list</button>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-black">Article Details</h2>
              <div className="flex gap-3">
                <button onClick={() => {navigator.clipboard.writeText(viewArticle.rewritten_text); alert("Copied!")}} className="px-4 py-2 bg-gray-100 rounded font-bold text-sm">Copy Result</button>
                <button onClick={() => handleDeleteSavedArticle(viewArticle.articleId)} className="px-4 py-2 bg-red-100 text-red-600 rounded font-bold text-sm">Delete</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-gray-50 rounded-xl border">
                <div className="text-xs font-bold text-gray-400 uppercase mb-4">Original Text</div>
                <div className="whitespace-pre-wrap text-sm text-gray-700">{viewArticle.original_text}</div>
              </div>
              <div className="p-6 bg-[#fafbfe] rounded-xl border border-[#e1fff7]">
                <div className="text-xs font-bold text-[#03d665] uppercase mb-4">Rewritten Result ({viewArticle.mode === "rewrite" ? "SEO" : "AI Bypass"})</div>
                <div className="whitespace-pre-wrap text-sm text-black">{viewArticle.rewritten_text}</div>
              </div>
            </div>
          </div>
        )
      }

      return (
        <div className="max-w-[1000px] mx-auto bg-white rounded-xl shadow-sm border border-[#f1f1f1] p-8">
          <h2 className="text-2xl font-bold text-black mb-6">Saved Articles</h2>
          {loadingSaved ? (
             <div className="text-center py-10">Loading...</div>
          ) : savedArticles.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <div className="text-4xl mb-4">📂</div>
              <p className="text-gray-500 font-medium">You don't have any saved articles yet.</p>
              <button className="mt-4 px-6 py-2 bg-[#03d665] text-white rounded font-bold hover:bg-[#02a64e]" onClick={()=>handleModeChange("rewrite")}>Start Rewriting</button>
            </div>
          ) : (
            <div className="grid gap-4">
              {savedArticles.map((article) => (
                <div key={article.articleId} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 border rounded-xl hover:shadow-sm bg-[#fafbfe] transition">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${article.mode === 'rewrite' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                        {article.mode === 'rewrite' ? 'SEO Rewrite' : 'AI Bypass'}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(article.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm font-medium text-black line-clamp-2">
                      {article.original_text.substring(0, 150)}...
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button onClick={() => setViewArticle(article)} className="px-4 py-2 bg-white border rounded font-bold text-sm text-black hover:bg-gray-50">View</button>
                    <button onClick={() => handleDeleteSavedArticle(article.articleId)} className="px-4 py-2 bg-white border border-red-100 rounded font-bold text-sm text-red-500 hover:bg-red-50">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // 📚 BULK REWRITE UI
    if (mode === "bulk") return (
      <div className="max-w-[1000px] mx-auto bg-white rounded-xl shadow-sm border border-[#f1f1f1] p-8">
        <h2 className="text-2xl font-bold text-black mb-2">Bulk Rewrite</h2>
        <p className="text-gray-500 text-sm mb-6">Upload a CSV/TXT file or paste multiple articles to process them at once.</p>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:bg-gray-50 transition cursor-pointer">
          <div className="text-4xl mb-4">📄</div>
          <div className="font-bold text-black mb-1">Click to Upload File</div>
          <div className="text-xs text-gray-400">Supports .txt and .csv (Max 50 articles per batch)</div>
        </div>
        <button className="mt-6 w-full py-3 bg-[#03d665] text-white font-bold rounded-lg opacity-50 cursor-not-allowed">Process Batch (Coming Soon)</button>
      </div>
    );

    // ⚙️ API UI
    if (mode === "api") return (
      <div className="max-w-[1000px] mx-auto bg-white rounded-xl shadow-sm border border-[#f1f1f1] p-8">
        <h2 className="text-2xl font-bold text-black mb-2">API Access</h2>
        <p className="text-gray-500 text-sm mb-6">Integrate ZeroWordAi into your own applications.</p>
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
          <label className="block text-xs font-bold text-black uppercase mb-2">Your Secret API Key</label>
          <div className="flex gap-4">
            <input type="password" value="sk-live-xxxxxxxxxxxxxxxxxxxxxxxx" readOnly className="flex-1 p-3 border rounded outline-none bg-white font-mono" />
            <button className="px-6 py-3 bg-black text-white rounded font-bold hover:bg-gray-800">Copy Key</button>
          </div>
        </div>
      </div>
    );

    // 🛠️ SETTINGS UI
    if (mode === "settings") return (
      <div className="max-w-[1000px] mx-auto bg-white rounded-xl shadow-sm border border-[#f1f1f1] p-8">
        <h2 className="text-2xl font-bold text-black mb-6">Rewrite Settings</h2>
        <div className="space-y-6 max-w-lg">
          <div>
            <label className="block text-sm font-bold text-black mb-2">Default Tone</label>
            <select className="w-full p-3 border rounded outline-none font-medium"><option>Regular</option><option>Fluent</option><option>Creative</option></select>
          </div>
          <button className="px-8 py-3 bg-[#03d665] text-white rounded font-bold hover:bg-[#02a64e]">Save Settings</button>
        </div>
      </div>
    );

    // 📊 USAGE INFO UI
    if (mode === "usage") return (
      <div className="max-w-[1000px] mx-auto bg-white rounded-xl shadow-sm border border-[#f1f1f1] p-8">
        <h2 className="text-2xl font-bold text-black mb-6">Usage Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-xl bg-blue-50">
            <div className="text-sm font-bold text-blue-600 uppercase mb-2">SEO Words Remaining</div>
            <div className="text-4xl font-extrabold text-black mb-4">{seoWords}</div>
          </div>
          <div className="p-6 border rounded-xl bg-green-50">
            <div className="text-sm font-bold text-[#03d665] uppercase mb-2">Bypass Words Remaining</div>
            <div className="text-4xl font-extrabold text-black mb-4">{bypassWords}</div>
          </div>
        </div>
      </div>
    );

    // 🤝 AFFILIATE UI
    if (mode === "affiliate") return (
      <div className="max-w-[1000px] mx-auto bg-white rounded-xl shadow-sm border border-[#f1f1f1] p-8">
        <h2 className="text-2xl font-bold text-black mb-2">Affiliate Program</h2>
        <p className="text-gray-500 text-sm mb-6">Earn 30% recurring commission for every user you refer.</p>
        <div className="flex gap-4 mb-8">
          <input type="text" value={`https://zerowordai.com/?ref=${user.id.slice(-6)}`} readOnly className="flex-1 p-3 border rounded outline-none bg-gray-50 font-mono text-sm" />
          <button className="px-6 py-3 bg-[#03d665] text-white rounded font-bold hover:bg-[#02a64e]">Copy Link</button>
        </div>
      </div>
    );

    // 💳 BILLING UI
    if (mode === "billing") return (
      <div className="max-w-[1000px] mx-auto bg-white rounded-xl shadow-sm border border-[#f1f1f1] p-8">
        <h2 className="text-2xl font-bold text-black mb-6">Billing & Plan</h2>
        <div className="bg-gray-50 border border-gray-200 p-8 rounded-xl flex justify-between items-center">
          <div>
            <div className="text-sm font-bold text-gray-500 uppercase mb-1">Current Plan</div>
            <div className="text-3xl font-extrabold text-black">{planName} Plan</div>
            <div className="text-sm text-gray-500 mt-2">Active Email: {user.primaryEmailAddress?.emailAddress}</div>
          </div>
          <button onClick={() => router.push("/pricing")} className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800">Upgrade Plan</button>
        </div>
      </div>
    );

    // 🎧 SUPPORT UI
    if (mode === "support") return (
      <div className="max-w-[1000px] mx-auto bg-white rounded-xl shadow-sm border border-[#f1f1f1] p-8">
        <h2 className="text-2xl font-bold text-black mb-6">Support & Help</h2>
        <form className="space-y-4 max-w-lg" onSubmit={(e)=>e.preventDefault()}>
          <div><label className="block text-sm font-bold text-black mb-1">Subject</label><input type="text" placeholder="How can we help?" className="w-full p-3 border rounded outline-none font-medium" /></div>
          <div><label className="block text-sm font-bold text-black mb-1">Message</label><textarea rows="5" placeholder="Describe your issue..." className="w-full p-3 border rounded outline-none font-medium resize-none"></textarea></div>
          <button className="px-8 py-3 bg-[#03d665] text-white rounded font-bold hover:bg-[#02a64e]">Send Message</button>
        </form>
      </div>
    );
  };

  return (
    <>
      {/* 🚀 Global Custom CSS For Quill Editor to Match UI */}
      <style jsx global>{`
        .quill-wrapper { display: flex; flex-direction: column; height: 100%; }
        .quill-wrapper .quill { display: flex; flex-direction: column; flex: 1; }
        .quill-wrapper .ql-toolbar { border: none !important; border-bottom: 1px solid #f1f1f1 !important; background: #ffffff; padding: 12px 20px !important; }
        .quill-wrapper .ql-container { flex: 1; border: none !important; font-size: 14px !important; font-family: inherit !important; color: #585858 !important; overflow-y: auto; }
        .quill-wrapper .ql-editor { min-height: 250px; padding: 24px !important; line-height: 1.8; }
        .quill-wrapper .ql-editor:focus { outline: none; }
        .output-quill .ql-toolbar { background: #fafbfe !important; }
      `}</style>

      <div className="flex h-screen bg-[#fafbfe] text-[#585858] font-sans overflow-hidden selection:bg-[#03d665] selection:text-white">
        
        <div className="w-[260px] bg-white border-r border-[#f1f1f1] flex flex-col shadow-sm z-20 hidden lg:flex">
          <div className="h-[75px] flex items-center px-6 border-b border-[#f1f1f1]">
            <div className="text-[26px] font-bold tracking-tight text-[#000000] cursor-pointer" onClick={() => router.push("/")}>
              ZeroWord<span className="text-[#03d665]">Ai</span>
            </div>
          </div>
          <div className="py-4 flex-1 overflow-y-auto">
            {sidebarMenus.map((menu) => (
              <button 
                key={menu.id} onClick={() => handleModeChange(menu.id)}
                className={`w-full flex items-center px-6 py-[12px] font-medium text-[15px] transition-colors ${mode === menu.id ? "bg-[#e1fff7] text-[#03d665] border-r-4 border-[#03d665]" : "text-[#585858] hover:text-[#03d665]"}`}
              >
                <span className="mr-3 text-lg">{menu.icon}</span> {menu.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-[75px] bg-white border-b border-[#f1f1f1] flex items-center justify-between px-6 z-10 shadow-sm">
            <div className="flex items-center lg:hidden"><div className="text-[22px] font-bold text-[#000000]">ZeroWord<span className="text-[#03d665]">Ai</span></div></div>
            
            <div className="hidden lg:block text-[#000000] font-bold text-lg">
              {sidebarMenus.find(m => m.id === mode)?.label || "Dashboard"}
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="hidden md:flex items-center bg-[#fafbfe] border border-[#f1f1f1] px-4 py-1.5 rounded-full text-[12px] font-bold text-[#585858]">
                {mode === "rewrite" ? (<>SEO Words: <span className="text-blue-500 ml-1.5">{seoWords}</span></>) : (<>Bypass Words: <span className="text-[#03d665] ml-1.5">{bypassWords}</span></>)}
              </div>
              <button onClick={() => setShowCouponModal(true)} className="text-xs font-bold bg-[#e1fff7] text-[#03d665] px-3 py-1.5 rounded-full hover:bg-[#03d665] hover:text-white transition">🎁 Redeem Code</button>
              <button onClick={() => router.push("/pricing")} className="hidden sm:block text-xs font-bold text-[#000] hover:text-[#03d665]">Upgrade</button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>

          <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#fafbfe]">
            {renderContent()}
          </div>
        </div>

        {showCouponModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative">
              <button onClick={() => setShowCouponModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-xl">&times;</button>
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🎁</div>
                <h2 className="text-xl font-extrabold text-black">Redeem Promo Code</h2>
                <p className="text-sm text-gray-500 mt-1">Enter your promo code to unlock premium features.</p>
              </div>
              <input 
                type="text" placeholder="e.g. SUMO-A1B2C3D4" 
                className="w-full border-2 border-gray-200 focus:border-[#03d665] p-3 rounded-xl outline-none font-mono font-bold text-center text-lg text-black mb-4 uppercase"
                value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
              />
              <button 
                onClick={handleRedeem} disabled={redeemLoading || !couponCode}
                className="w-full py-3 bg-[#03d665] text-white rounded-xl font-bold text-lg shadow-lg hover:bg-[#02a64e] disabled:opacity-50 transition"
              >
                {redeemLoading ? "Verifying..." : "Redeem Now"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}