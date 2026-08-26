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
          <Link href="#avoid-ai" className="hover:text-[#03d665] transition-colors">Avoid AI Detection</Link>
          <Link href="#features" className="hover:text-[#03d665] transition-colors">Content Writers</Link>
          <Link href="#seo" className="hover:text-[#03d665] transition-colors">SEO</Link>
          <Link href="#pricing" className="hover:text-[#03d665] transition-colors">Pricing</Link>
          <Link href="#contact" className="hover:text-[#03d665] transition-colors">Contact</Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="font-medium text-[15px] hover:text-[#03d665] transition-colors hidden sm:block">
            Login
          </Link>
          <Link 
            href="/dashboard" 
            className="px-6 py-2.5 bg-[#03d665] hover:bg-[#02a64e] text-white font-medium rounded text-[15px] transition-colors shadow-md"
          >
            Try it Free!
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="bg-[#fafbfe] pt-20 pb-24 px-6 lg:px-16 border-b border-[#f1f1f1]">
        <div className="max-w-[1200px] mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#000000] tracking-tight leading-[1.15] mb-6">
              10x your content output with AI.
            </h1>
            <p className="text-lg md:text-xl mb-10 text-[#585858] leading-relaxed">
              Use artificial intelligence to cut turnaround time, extend your budget, and create more high-quality content that Google and readers will love.
            </p>
            <Link 
              href="/dashboard" 
              className="inline-block px-10 py-4 bg-[#03d665] hover:bg-[#02a64e] text-white text-[16px] font-bold rounded transition-all shadow-md"
            >
              Start your free trial!
            </Link>
          </div>
          <div className="flex-1 relative w-full max-w-lg mx-auto">
            {/* Placeholder for Hero Editor Image/Video */}
            <div className="w-full h-[350px] bg-white rounded-xl shadow-2xl border border-[#f1f1f1] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#e1fff7] to-white opacity-50"></div>
              <div className="w-20 h-20 bg-[#03d665] text-white rounded-full flex items-center justify-center text-3xl shadow-lg cursor-pointer hover:scale-105 transition-transform z-10">
                ▶
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Capabilities / Tabs Section */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#000000] mb-4">What is ZeroWordAi capable of?</h2>
            <div className="w-24 h-1 bg-[#03d665] mx-auto mb-6"></div>
            <p className="text-[18px] text-[#585858] max-w-3xl mx-auto">
              ZeroWordAi uses advanced machine learning models to provide high quality rewriting that is indistinguishable from human content.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Tabs Navigation */}
            <div className="flex flex-col gap-3 w-full lg:w-1/3">
              {[
                { id: 1, title: "Complete sentence restructuring" },
                { id: 2, title: "Enrich Text" },
                { id: 3, title: "Describe the same ideas differently" },
                { id: 4, title: "Improve Quality" },
                { id: 5, title: "Improve Clarity" },
                { id: 6, title: "Split sentences" },
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
                  <h4 className="text-2xl font-bold text-[#000000] mb-4">Completely restructure sentences</h4>
                  <p className="text-[16px] leading-relaxed">ZeroWordAi understands the meaning of each sentence, then rewrites it from scratch while optimizing for uniqueness and readability. This allows ZeroWordAi to completely restructure your sentences while keeping the same overall meaning.</p>
                </div>
              )}
              {activeTab === 2 && (
                <div>
                  <h4 className="text-2xl font-bold text-[#000000] mb-4">Enrich your text</h4>
                  <p className="text-[16px] leading-relaxed">When ZeroWordAi reads your content, it understands the meaning behind each word. Because of that, the AI can properly identify and add LSI keywords that make each rewrite more unique and primed to rank higher.</p>
                </div>
              )}
              {activeTab === 3 && (
                <div>
                  <h4 className="text-2xl font-bold text-[#000000] mb-4">Describe the same ideas differently</h4>
                  <p className="text-[16px] leading-relaxed">ZeroWordAi can come up with hundreds of different ways to express the same ideas. This not only prevents duplicate content, it also provides great copy alternatives and can help you beat writer’s block.</p>
                </div>
              )}
               {activeTab === 4 && (
                <div>
                  <h4 className="text-2xl font-bold text-[#000000] mb-4">Eliminate spelling and grammar mistakes</h4>
                  <p className="text-[16px] leading-relaxed">As ZeroWordAi rewrites your text, it fixes any spelling or grammar mistakes, making your rewrites even higher quality than the originals.</p>
                </div>
              )}
               {activeTab === 5 && (
                <div>
                  <h4 className="text-2xl font-bold text-[#000000] mb-4">Make your writing clearer and more concise</h4>
                  <p className="text-[16px] leading-relaxed">ZeroWordAi refines wordy content into clear and concise rewrites that help you communicate your ideas more effectively.</p>
                </div>
              )}
               {activeTab === 6 && (
                <div>
                  <h4 className="text-2xl font-bold text-[#000000] mb-4">Naturally split sentences</h4>
                  <p className="text-[16px] leading-relaxed">Short, concise sentences make it easier for people to understand what you are saying. ZeroWordAi takes long run-on sentences and splits them naturally so they are short, clear, and effective.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Benefits (Impact) */}
      <section className="py-24 bg-[#fafbfe] border-y border-[#f1f1f1] px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#000000]">Make an impact with artificial intelligence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded shadow-sm border border-[#f1f1f1]">
              <h4 className="text-xl font-bold text-[#000000] mb-4"><span className="text-[#03d665]">Amplify</span> your content</h4>
              <p className="text-[15px] leading-relaxed">Fill out your content calendar, diversify your marketing copy, and supercharge your content strategy all in a fraction of the time it would take otherwise.</p>
            </div>
            <div className="bg-white p-8 rounded shadow-sm border border-[#f1f1f1]">
              <h4 className="text-xl font-bold text-[#000000] mb-4"><span className="text-[#03d665]">Extend</span> your budget</h4>
              <p className="text-[15px] leading-relaxed">More high quality content means better rankings. With ZeroWordAi, you don’t need to have an unlimited budget to create a full SEO content pipeline that will have you ranking at the top of Google.</p>
            </div>
            <div className="bg-white p-8 rounded shadow-sm border border-[#f1f1f1]">
              <h4 className="text-xl font-bold text-[#000000] mb-4"><span className="text-[#03d665]">Scale</span> your business</h4>
              <p className="text-[15px] leading-relaxed">Make your entire content production process 10x more efficient. Use AI to create more high-quality, unique content that impresses clients and engages readers, all without having to put in more hours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Features Grid */}
      <section id="features" className="py-24 bg-white px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#000000] mb-4">Features</h2>
            <div className="w-24 h-1 bg-[#03d665] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h5 className="text-[20px] font-bold text-[#000000] mb-3 flex items-center gap-3"><span className="text-[#03d665] text-2xl">💡</span> No Duplicate Content</h5>
              <p className="text-[15px] leading-relaxed">ZeroWordAi comes up with different ways to express the same ideas by rewriting every sentence from scratch. This not only removes duplicate content, it also makes the rewritten content read completely naturally.</p>
            </div>
            <div>
              <h5 className="text-[20px] font-bold text-[#000000] mb-3 flex items-center gap-3"><span className="text-[#03d665] text-2xl">⏳</span> Turnaround time</h5>
              <p className="text-[15px] leading-relaxed">ZeroWordAi can rewrite an entire article in just a few seconds. With speeds that fast, you can 10x your content output. Consistently beat deadlines, minimize turnaround time, and spend more time focusing on the rest of your business.</p>
            </div>
            <div>
              <h5 className="text-[20px] font-bold text-[#000000] mb-3 flex items-center gap-3"><span className="text-[#03d665] text-2xl">⚙️</span> Control</h5>
              <p className="text-[15px] leading-relaxed">ZeroWordAi allows you to adjust how creative it is. Make ZeroWordAi more conservative to keep more of your original content. Or, make it more adventurous to maximize your SEO impact.</p>
            </div>
            <div>
              <h5 className="text-[20px] font-bold text-[#000000] mb-3 flex items-center gap-3"><span className="text-[#03d665] text-2xl">📄</span> 1-1,000 rewrites</h5>
              <p className="text-[15px] leading-relaxed">Beat writer’s block with multiple variations of your content. Create up to 1,000 rewrites per original article to get the most value out of each piece of content you create.</p>
            </div>
            <div className="md:col-span-2 max-w-2xl mx-auto text-center mt-6">
              <h5 className="text-[20px] font-bold text-[#000000] mb-3 flex items-center justify-center gap-3"><span className="text-[#03d665] text-2xl">🔍</span> Avoid AI Content Detection</h5>
              <p className="text-[15px] leading-relaxed">ZeroWordAi humanizes your content, improving its quality while allowing it to pass as human in AI detectors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Extended Functionality */}
      <section className="py-20 bg-[#fafbfe] px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h4 className="text-2xl font-bold text-[#000000]">Extended functionality to support any use case</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded shadow-sm border border-[#f1f1f1]">
              <h5 className="font-bold text-[#000000] mb-2 text-lg">Bulk rewrite</h5>
              <p className="text-[14px]">Upload all of your articles at once to save you even more time.</p>
            </div>
            <div className="p-6 bg-white rounded shadow-sm border border-[#f1f1f1]">
              <h5 className="font-bold text-[#000000] mb-2 text-lg">API</h5>
              <p className="text-[14px]">Add article rewriting directly to any workflow.</p>
            </div>
            <div className="p-6 bg-white rounded shadow-sm border border-[#f1f1f1]">
              <h5 className="font-bold text-[#000000] mb-2 text-lg">HTML Compatible</h5>
              <p className="text-[14px]">ZeroWordAi supports HTML content.</p>
            </div>
            <div className="p-6 bg-white rounded shadow-sm border border-[#f1f1f1]">
              <h5 className="font-bold text-[#000000] mb-2 text-lg">Bulk download</h5>
              <p className="text-[14px]">Export your rewrites as spintax or in bulk to increase efficiency even more.</p>
            </div>
            <div className="p-6 bg-white rounded shadow-sm border border-[#f1f1f1]">
              <h5 className="font-bold text-[#000000] mb-2 text-lg">Code View</h5>
              <p className="text-[14px]">View and edit your rewrites in HTML and rich-text.</p>
            </div>
            <div className="p-6 bg-white rounded shadow-sm border border-[#f1f1f1]">
              <h5 className="font-bold text-[#000000] mb-2 text-lg">Article Forge integration</h5>
              <p className="text-[14px]">Import entire unique articles about any topic with the click of a button.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pricing Section */}
      <section id="pricing" className="py-24 bg-white px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#000000] mb-4">Start your completely <span className="text-[#03d665]">free</span> 3-day trial today!</h2>
            <div className="w-24 h-1 bg-[#03d665] mx-auto mb-6"></div>
            <p className="text-[18px] text-[#585858]">See for yourself how ZeroWordAi will transform your content strategy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Monthly */}
            <div className="bg-white border border-[#f1f1f1] rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-[#000000] mb-4">Monthly</h3>
              <div className="mb-6">
                <h2 className="text-5xl font-black text-[#000000]"><span className="text-2xl align-top">$</span>57</h2>
                <small className="text-[#03d665] font-bold">/month</small>
              </div>
              <ul className="text-[15px] space-y-3 mb-8 text-left max-w-[200px] mx-auto">
                <li className="flex items-center gap-2">✓ Pass AI detection</li>
                <li className="flex items-center gap-2">✓ AI-powered rewriter</li>
                <li className="flex items-center gap-2">✓ Human quality content</li>
                <li className="flex items-center gap-2">✓ One click rewriting</li>
                <li className="flex items-center gap-2">✓ Bulk article rewriting</li>
                <li className="flex items-center gap-2">✓ API access</li>
              </ul>
              <Link href="/dashboard" className="block w-full py-3 rounded-full bg-[#03d665] hover:bg-[#02a64e] text-white font-bold transition-colors">
                Start my free trial!
              </Link>
            </div>

            {/* Yearly (Active/Highlighted) */}
            <div className="bg-[#fafbfe] border-2 border-[#03d665] rounded-lg p-10 text-center shadow-xl transform md:-translate-y-4 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#03d665] text-white px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold text-[#000000] mb-4">Yearly</h3>
              <div className="mb-6">
                <h2 className="text-6xl font-black text-[#000000]"><span className="text-3xl align-top">$</span>27</h2>
                <small className="text-[#03d665] font-bold">/month</small>
                <div className="text-[12px] text-gray-500 mt-1">(billed annually)</div>
              </div>
              <ul className="text-[15px] space-y-3 mb-8 text-left max-w-[200px] mx-auto font-medium">
                <li className="flex items-center gap-2">✓ Pass AI detection</li>
                <li className="flex items-center gap-2">✓ AI-powered rewriter</li>
                <li className="flex items-center gap-2">✓ Human quality content</li>
                <li className="flex items-center gap-2">✓ One click rewriting</li>
                <li className="flex items-center gap-2">✓ Bulk article rewriting</li>
                <li className="flex items-center gap-2">✓ API access</li>
              </ul>
              <Link href="/dashboard" className="block w-full py-4 rounded-full bg-[#03d665] hover:bg-[#02a64e] text-white font-bold text-lg transition-colors shadow-md">
                Start my free trial!
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white border border-[#f1f1f1] rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-[#000000] mb-4">Enterprise</h3>
              <div className="mb-6">
                <h2 className="text-4xl font-black text-[#000000] mt-4 mb-2">Custom</h2>
                <div className="text-[12px] text-transparent mt-1">.</div>
              </div>
              <ul className="text-[15px] space-y-3 mb-8 text-left max-w-[220px] mx-auto">
                <li className="font-bold text-[#000000]">All standard features plus:</li>
                <li className="flex items-center gap-2">✓ High volume usage</li>
                <li className="flex items-center gap-2">✓ Increased throughput</li>
                <li className="flex items-center gap-2">✓ Multiple user accounts</li>
                <li className="flex items-center gap-2">✓ Customized rewrites</li>
                <li className="flex items-center gap-2">✓ Account manager</li>
              </ul>
              <Link href="#contact" className="block w-full py-3 rounded-full bg-white border-2 border-[#f1f1f1] hover:border-[#03d665] text-[#585858] font-bold transition-colors">
                Contact Us!
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Money Back Guarantee */}
      <section className="pb-24 px-6 bg-white">
        <div className="max-w-[1000px] mx-auto bg-[#fafbfe] border border-[#f1f1f1] p-10 rounded-xl shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="text-6xl">🛡️</div>
          <div>
            <h4 className="text-2xl font-bold text-[#000000] mb-3">30-Day No Risk Money Back Guarantee</h4>
            <p className="text-[15px] leading-relaxed">
              We are confident that ZeroWordAi will redefine how you rewrite content, so we want to make sure there is absolutely no risk to try ZeroWordAi.<br/><br/>
              <b>So, beyond our 3-day free trial, we also offer a no strings attached 30-day money back guarantee.</b> If you use ZeroWordAi to rewrite less than 10 articles and find that it isn't the solution for you, just contact us and we'll give you a hassle-free refund with no questions asked!
            </p>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-[#01041b] text-[#ccced2] py-16 border-t border-[#f1f1f1]">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
          <div className="col-span-1 md:col-span-1">
            <div className="text-[26px] font-bold tracking-tight text-white mb-6">
              ZeroWord<span className="text-[#03d665]">Ai</span>
            </div>
            <p className="text-[13px] leading-relaxed mb-6 opacity-80">
              <b>901 South Bond Street <br/> Suite 204 <br/> Baltimore, MD, 21231 <br/> USA</b>
            </p>
          </div>
          <div>
            <ul className="space-y-4 text-[14px]">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="#affiliate" className="hover:text-white transition-colors">Affiliate</Link></li>
              <li><Link href="#blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <ul className="space-y-4 text-[14px]">
              <li><Link href="#seo" className="hover:text-white transition-colors">SEO</Link></li>
              <li><Link href="#content-writers" className="hover:text-white transition-colors">Content Writers</Link></li>
              <li><Link href="#spintax" className="hover:text-white transition-colors">Spintax</Link></li>
            </ul>
          </div>
          <div>
            <ul className="space-y-4 text-[14px]">
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-[1200px] mx-auto px-6 mt-16 pt-8 border-t border-[#343a40] text-[13px] text-center opacity-60">
          Copyright © {new Date().getFullYear()} ZeroWordAi | All Rights Reserved | Terms of Service | Privacy Policy
        </div>
      </footer>

    </div>
  );
}