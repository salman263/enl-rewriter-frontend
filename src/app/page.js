"use client";

import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="min-h-screen bg-white text-[#585858] font-sans selection:bg-[#03d665] selection:text-white pb-10">
      
      {/* 1. Header / Navbar */}
      <header className="h-[80px] bg-white flex items-center justify-between px-6 lg:px-16 sticky top-0 z-50 shadow-sm border-b border-[#f1f1f1]">
        <Link href="/" className="text-[26px] font-bold tracking-tight text-[#000000]">
          ZeroWord<span className="text-[#03d665]">Ai</span>
        </Link>
        <div className="hidden lg:flex items-center gap-8 font-medium text-[15px]">
          <Link href="#avoid-ai" className="hover:text-[#03d665] transition-colors">AI Bypass</Link>
          <Link href="#features" className="hover:text-[#03d665] transition-colors">Semantic SEO</Link>
          <Link href="#how-it-works" className="hover:text-[#03d665] transition-colors">How it Works</Link>
          <Link href="#pricing" className="hover:text-[#03d665] transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="font-medium text-[15px] hover:text-[#03d665] transition-colors hidden sm:block">
            Login
          </Link>
          <Link 
            href="/dashboard" 
            className="px-6 py-2.5 bg-[#03d665] hover:bg-[#02a64e] text-white font-medium rounded text-[15px] transition-colors shadow-md"
          >
            Try it Free
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="bg-[#fafbfe] pt-20 pb-24 px-6 lg:px-16 border-b border-[#f1f1f1] overflow-hidden">
        <div className="max-w-[1200px] mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#000000] tracking-tight leading-[1.15] mb-6">
              Rewrite Content That Ranks & <span className="text-[#03d665]">Bypasses AI.</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-[#585858] leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Powered by advanced NLP algorithms, ZeroWordAi transforms ordinary text into high-ranking, human-like content that Google loves and detectors can't catch.
            </p>
            <Link 
              href="/dashboard" 
              className="inline-block px-10 py-4 bg-[#03d665] hover:bg-[#02a64e] text-white text-[16px] font-bold rounded transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              Start Rewriting Now
            </Link>
            <p className="mt-4 text-[13px] text-gray-400 font-medium">No credit card required • Free trial included</p>
          </div>
          
          {/* MODERN UI MOCKUP (Replaced the Box) */}
          <div className="flex-1 relative w-full max-w-lg mx-auto z-10 perspective-1000">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-[#e1fff7] to-[#b4f0dc] rounded-full blur-3xl opacity-50 z-0"></div>
            
            {/* App Window UI */}
            <div className="w-full bg-white rounded-xl shadow-2xl border border-[#f1f1f1] overflow-hidden transform md:rotate-2 hover:rotate-0 transition-transform duration-500 relative z-10">
              {/* Mac-style Top Bar */}
              <div className="bg-[#fafbfe] px-4 py-3 border-b border-[#f1f1f1] flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                <div className="ml-4 text-[12px] text-gray-400 font-medium">ZeroWordAi Workspace</div>
              </div>
              
              {/* Editor Content */}
              <div className="p-6 text-left">
                <div className="mb-4">
                  <div className="text-[11px] font-bold text-[#c2c2c2] uppercase tracking-wider mb-2">Original Text</div>
                  <div className="text-[14px] text-[#585858] bg-[#fafbfe] p-4 rounded border border-[#f1f1f1] line-clamp-2">
                    AI tools can write things fast, but they usually sound like robots and get penalized by Google algorithms.
                  </div>
                </div>
                
                <div className="flex justify-center mb-4 relative">
                  <div className="absolute top-1/2 left-0 w-full h-px bg-[#f1f1f1] z-0"></div>
                  <div className="bg-[#e1fff7] text-[#03d665] px-4 py-1.5 rounded-full text-[12px] font-bold shadow-sm relative z-10 flex items-center gap-2">
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Humanizing...
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-[#03d665] uppercase tracking-wider mb-2 flex justify-between">
                    <span>Rewritten Output</span>
                    <span className="bg-[#e1fff7] px-2 rounded text-[10px]">✨ Highlights On</span>
                  </div>
                  <div className="text-[14px] text-[#585858] bg-white p-4 rounded border border-[#03d665] shadow-[0_0_15px_rgba(3,214,101,0.1)] leading-relaxed">
                    While <span className="text-[#03d665] bg-[#e1fff7] font-medium px-1 rounded">automated platforms</span> accelerate content creation, preserving a <span className="text-[#03d665] bg-[#e1fff7] font-medium px-1 rounded">genuine human flow</span> is crucial to <span className="text-[#03d665] bg-[#e1fff7] font-medium px-1 rounded">bypass strict search penalties</span>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Capabilities / Tabs Section */}
      <section id="features" className="py-24 bg-white px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#000000] mb-4">Why ZeroWordAi is Different?</h2>
            <div className="w-24 h-1 bg-[#03d665] mx-auto mb-6"></div>
            <p className="text-[18px] text-[#585858] max-w-3xl mx-auto">
              We don't just spin words. We rebuild your content using Semantic SEO and Burstiness patterns to ensure it dominates search results.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Tabs Navigation */}
            <div className="flex flex-col gap-3 w-full lg:w-1/3">
              {[
                { id: 1, title: "Semantic SEO Optimization" },
                { id: 2, title: "100% AI Detection Bypass" },
                { id: 3, title: "Context & Entity Preservation" },
                { id: 4, title: "No Robotic Phrasing" },
                { id: 5, title: "Multiple Variations" },
                { id: 6, title: "Smart Highlight Tracker" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left px-6 py-4 rounded shadow-sm font-bold text-[15px] transition-all border-l-4 ${
                    activeTab === tab.id 
                      ? "bg-white border-[#03d665] text-[#03d665] shadow-md" 
                      : "bg-[#fafbfe] border-transparent text-[#585858] hover:bg-white"
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="w-full lg:w-2/3 bg-[#fafbfe] rounded-xl p-8 lg:p-12 border border-[#f1f1f1] flex items-center">
              {activeTab === 1 && (
                <div>
                  <h4 className="text-2xl font-bold text-[#000000] mb-4">Semantic SEO Optimization</h4>
                  <p className="text-[16px] leading-relaxed">Our engine naturally injects Latent Semantic Indexing (LSI) keywords into your text. It aligns perfectly with Google’s Helpful Content Update and EEAT guidelines, helping your content rank higher without keyword stuffing.</p>
                </div>
              )}
              {activeTab === 2 && (
                <div>
                  <h4 className="text-2xl font-bold text-[#000000] mb-4">100% AI Detection Bypass</h4>
                  <p className="text-[16px] leading-relaxed">ZeroWordAi introduces high burstiness and perplexity to your content. By varying sentence lengths and vocabulary, we guarantee a native, human-like score on strict detectors like Originality.ai and Turnitin.</p>
                </div>
              )}
              {activeTab === 3 && (
                <div>
                  <h4 className="text-2xl font-bold text-[#000000] mb-4">Context & Entity Preservation</h4>
                  <p className="text-[16px] leading-relaxed">Unlike basic spinners that destroy the meaning of your text, our AI identifies core entities (brand names, places, data) and preserves them perfectly while restructuring the surrounding sentences.</p>
                </div>
              )}
               {activeTab === 4 && (
                <div>
                  <h4 className="text-2xl font-bold text-[#000000] mb-4">No Robotic Phrasing</h4>
                  <p className="text-[16px] leading-relaxed">Tired of words like "Furthermore," "Moreover," and "In conclusion"? Our engine is specifically trained to avoid typical ChatGPT patterns, ensuring your writing feels authentic and conversational.</p>
                </div>
              )}
               {activeTab === 5 && (
                <div>
                  <h4 className="text-2xl font-bold text-[#000000] mb-4">Generate Multiple Variations</h4>
                  <p className="text-[16px] leading-relaxed">Need options? Generate up to 3 distinct, highly creative variations of your article in a single click. Choose the tone that best fits your audience—from conservative to highly adventurous.</p>
                </div>
              )}
               {activeTab === 6 && (
                <div>
                  <h4 className="text-2xl font-bold text-[#000000] mb-4">Smart Highlight Tracker</h4>
                  <p className="text-[16px] leading-relaxed">Our built-in visualizer highlights exactly which words and phrases were enhanced by the AI. You get complete transparency and control over your final content before publishing.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Benefits (Impact) */}
      <section id="avoid-ai" className="py-24 bg-[#fafbfe] border-y border-[#f1f1f1] px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#000000]">Scale your SEO Strategy with AI</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded shadow-sm border border-[#f1f1f1] hover:border-[#03d665] transition-colors">
              <h4 className="text-xl font-bold text-[#000000] mb-4"><span className="text-[#03d665]">Rank</span> Higher</h4>
              <p className="text-[15px] leading-relaxed">Build topical authority faster. Produce articles that perfectly match user intent and satisfy search engine algorithms without writing everything manually.</p>
            </div>
            <div className="bg-white p-8 rounded shadow-sm border border-[#f1f1f1] hover:border-[#03d665] transition-colors">
              <h4 className="text-xl font-bold text-[#000000] mb-4"><span className="text-[#03d665]">Save</span> Hours</h4>
              <p className="text-[15px] leading-relaxed">Stop spending countless hours trying to manually humanize AI-generated text. Let ZeroWordAi restructure your drafts in seconds.</p>
            </div>
            <div className="bg-white p-8 rounded shadow-sm border border-[#f1f1f1] hover:border-[#03d665] transition-colors">
              <h4 className="text-xl font-bold text-[#000000] mb-4"><span className="text-[#03d665]">Publish</span> Safely</h4>
              <p className="text-[15px] leading-relaxed">Publish with confidence knowing your content won't be penalized by Google's spam updates or flagged by academic and professional AI detectors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Features Grid */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#000000] mb-4">Core Technology</h2>
            <div className="w-24 h-1 bg-[#03d665] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h5 className="text-[20px] font-bold text-[#000000] mb-3 flex items-center gap-3"><span className="text-[#03d665] text-2xl">⚡</span> Advanced AI Engine</h5>
              <p className="text-[15px] leading-relaxed">ZeroWordAi is powered by state-of-the-art language models, ensuring that every rewritten piece is grammatically flawless, highly engaging, and contextually accurate.</p>
            </div>
            <div>
              <h5 className="text-[20px] font-bold text-[#000000] mb-3 flex items-center gap-3"><span className="text-[#03d665] text-2xl">🎯</span> Dynamic Tone Control</h5>
              <p className="text-[15px] leading-relaxed">Use our intuitive slider to adjust the strictness of the rewrite. Choose 'Conservative' for minor touch-ups or 'Max Human' for a complete, creative overhaul.</p>
            </div>
            <div>
              <h5 className="text-[20px] font-bold text-[#000000] mb-3 flex items-center gap-3"><span className="text-[#03d665] text-2xl">📋</span> Distraction-Free Editor</h5>
              <p className="text-[15px] leading-relaxed">Enjoy a clean, minimalist workspace designed for pure productivity. Paste your text, select your settings, and copy the final result with a single click.</p>
            </div>
            <div>
              <h5 className="text-[20px] font-bold text-[#000000] mb-3 flex items-center gap-3"><span className="text-[#03d665] text-2xl">🔒</span> Data Privacy</h5>
              <p className="text-[15px] leading-relaxed">Your content is your property. We process your articles securely and do not store your proprietary texts or use them to train public models.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pricing Section */}
      <section id="pricing" className="py-24 bg-[#fafbfe] px-6 border-t border-[#f1f1f1]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#000000] mb-4">Start your <span className="text-[#03d665]">Free</span> Trial today!</h2>
            <div className="w-24 h-1 bg-[#03d665] mx-auto mb-6"></div>
            <p className="text-[18px] text-[#585858]">Join smart marketers who are dominating search results with ZeroWordAi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Monthly */}
            <div className="bg-white border border-[#f1f1f1] rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-[#000000] mb-4">Starter</h3>
              <div className="mb-6">
                <h2 className="text-5xl font-black text-[#000000]"><span className="text-2xl align-top">$</span>19</h2>
                <small className="text-[#03d665] font-bold">/month</small>
              </div>
              <ul className="text-[15px] space-y-3 mb-8 text-left max-w-[200px] mx-auto">
                <li className="flex items-center gap-2">✓ Pass AI detection</li>
                <li className="flex items-center gap-2">✓ Semantic SEO rewrites</li>
                <li className="flex items-center gap-2">✓ 50,000 words/month</li>
                <li className="flex items-center gap-2">✓ Syntax highlighting</li>
              </ul>
              <Link href="/dashboard" className="block w-full py-3 rounded-full bg-[#03d665] hover:bg-[#02a64e] text-white font-bold transition-colors">
                Start my free trial
              </Link>
            </div>

            {/* Yearly (Active/Highlighted) */}
            <div className="bg-white border-2 border-[#03d665] rounded-lg p-10 text-center shadow-xl transform md:-translate-y-4 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#03d665] text-white px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold text-[#000000] mb-4">Pro</h3>
              <div className="mb-6">
                <h2 className="text-6xl font-black text-[#000000]"><span className="text-3xl align-top">$</span>49</h2>
                <small className="text-[#03d665] font-bold">/month</small>
              </div>
              <ul className="text-[15px] space-y-3 mb-8 text-left max-w-[200px] mx-auto font-medium">
                <li className="flex items-center gap-2">✓ Pass strict AI detectors</li>
                <li className="flex items-center gap-2">✓ Advanced NLP Engine</li>
                <li className="flex items-center gap-2">✓ Unlimited words/month</li>
                <li className="flex items-center gap-2">✓ Multiple variations</li>
                <li className="flex items-center gap-2">✓ Priority Support</li>
              </ul>
              <Link href="/dashboard" className="block w-full py-4 rounded-full bg-[#03d665] hover:bg-[#02a64e] text-white font-bold text-lg transition-colors shadow-md">
                Get Started Now
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white border border-[#f1f1f1] rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-[#000000] mb-4">Agency</h3>
              <div className="mb-6">
                <h2 className="text-4xl font-black text-[#000000] mt-4 mb-2">Custom</h2>
                <div className="text-[12px] text-transparent mt-1">.</div>
              </div>
              <ul className="text-[15px] space-y-3 mb-8 text-left max-w-[220px] mx-auto">
                <li className="font-bold text-[#000000]">All Pro features plus:</li>
                <li className="flex items-center gap-2">✓ Team member accounts</li>
                <li className="flex items-center gap-2">✓ High volume throughput</li>
                <li className="flex items-center gap-2">✓ API Access (Coming Soon)</li>
                <li className="flex items-center gap-2">✓ Dedicated account manager</li>
              </ul>
              <Link href="#contact" className="block w-full py-3 rounded-full bg-white border-2 border-[#f1f1f1] hover:border-[#03d665] text-[#585858] font-bold transition-colors">
                Contact Sales
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Money Back Guarantee */}
      <section className="pb-24 pt-10 px-6 bg-[#fafbfe]">
        <div className="max-w-[1000px] mx-auto bg-white border border-[#f1f1f1] p-10 rounded-xl shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="text-6xl">🏆</div>
          <div>
            <h4 className="text-2xl font-bold text-[#000000] mb-3">100% Satisfaction Guarantee</h4>
            <p className="text-[15px] leading-relaxed">
              We are incredibly confident that ZeroWordAi will elevate your content production. Test our Semantic SEO and AI Bypass features risk-free.<br/><br/>
              If you aren't completely amazed by the quality of our rewrites within your first week, simply reach out to our support team and we will issue a full, hassle-free refund. Your success is our priority!
            </p>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-[#01041b] text-[#ccced2] py-16 border-t border-[#f1f1f1]">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
          <div className="col-span-1 md:col-span-1">
            <div className="text-[26px] font-bold tracking-tight text-white mb-6">
              ZeroWord<span className="text-[#03d665]">Ai</span>
            </div>
            <p className="text-[13px] leading-relaxed mb-6 opacity-80">
              The ultimate content rewriting platform. We merge Semantic SEO with advanced AI humanization to deliver content that ranks higher and bypasses detectors.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-[15px]">Features</h4>
            <ul className="space-y-4 text-[14px]">
              <li><Link href="#features" className="hover:text-white transition-colors">Semantic SEO</Link></li>
              <li><Link href="#avoid-ai" className="hover:text-[#03d665] transition-colors">Avoid AI Detection</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Multiple Variations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-[15px]">Resources</h4>
            <ul className="space-y-4 text-[14px]">
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog & Guides</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">API Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-[15px]">Company</h4>
            <ul className="space-y-4 text-[14px]">
              <li><Link href="#" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-[1200px] mx-auto px-6 mt-16 pt-8 border-t border-[#343a40] text-[13px] text-center opacity-60">
          Copyright © {new Date().getFullYear()} ZeroWordAi | Built for modern content creators.
        </div>
      </footer>

    </div>
  );
}