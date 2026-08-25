import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#585858] font-sans selection:bg-[#03d665] selection:text-white">
      
      {/* 1. Premium Navbar */}
      <header className="h-[80px] bg-white flex items-center justify-between px-6 lg:px-16 sticky top-0 z-50 border-b border-[#f1f1f1] transition-all">
        <div className="text-[26px] font-bold tracking-tight text-[#000000]">
          Word<span className="text-[#03d665]">Ai</span>
        </div>
        <div className="hidden md:flex items-center gap-10 font-medium text-[15px]">
          <Link href="#features" className="hover:text-[#03d665] transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-[#03d665] transition-colors">How it Works</Link>
          <Link href="#pricing" className="hover:text-[#03d665] transition-colors">Pricing</Link>
          <Link href="#" className="hover:text-[#03d665] transition-colors">API</Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="font-medium text-[15px] hover:text-[#03d665] transition-colors hidden sm:block">
            Login
          </Link>
          <Link 
            href="/dashboard" 
            className="px-6 py-2.5 bg-[#03d665] hover:bg-[#02a64e] text-white font-medium rounded text-[15px] transition-colors shadow-sm"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* 2. Hero Section (Clean & Minimalist) */}
      <section className="bg-[#fafbfe] pt-24 pb-20 px-6 lg:px-16 text-center border-b border-[#f1f1f1]">
        <div className="max-w-[900px] mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#000000] tracking-tight leading-[1.15] mb-6">
            Multiply Your Content Output <br className="hidden md:block" />
            <span className="text-[#03d665]">Without Sacrificing Quality.</span>
          </h1>
          <p className="text-lg md:text-xl mx-auto mb-10 text-[#585858] leading-relaxed max-w-[700px]">
            Use advanced AI to rewrite entire articles in seconds. Generate content that is Semantic SEO-optimized, highly readable, and easily bypasses AI detectors.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto px-10 py-4 bg-[#03d665] hover:bg-[#02a64e] text-white text-[16px] font-bold rounded transition-all shadow-md"
            >
              Start Your Free Trial
            </Link>
            <Link 
              href="#pricing" 
              className="w-full sm:w-auto px-10 py-4 bg-white border border-[#e1e1e1] hover:border-[#03d665] text-[#585858] hover:text-[#03d665] text-[16px] font-bold rounded transition-all shadow-sm"
            >
              View Pricing
            </Link>
          </div>
          <p className="mt-6 text-[13px] font-medium text-[#c2c2c2]">No risk. Cancel anytime. 5 free credits included.</p>
        </div>
      </section>

      {/* 3. Social Proof / Trusted By */}
      <section className="py-10 border-b border-[#f1f1f1] bg-white">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-[13px] font-bold text-[#c2c2c2] uppercase tracking-wider mb-6">Trusted by SEO professionals & content teams worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
            {/* Placeholder for logos */}
            <span className="text-2xl font-black text-[#000000]">Forbes</span>
            <span className="text-2xl font-black text-[#000000]">TechCrunch</span>
            <span className="text-2xl font-black text-[#000000]">Entrepreneur</span>
            <span className="text-2xl font-black text-[#000000]">SearchEngineLand</span>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#000000] mb-4">Content that actually reads like a human wrote it.</h2>
            <p className="text-[16px] text-[#585858]">WordAi uses advanced machine learning models to provide high-quality rewriting that is indistinguishable from human content.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-8 rounded-lg bg-[#fafbfe] border border-[#f1f1f1] hover:border-[#03d665] transition-colors">
              <div className="w-12 h-12 bg-[#e1fff7] text-[#03d665] flex items-center justify-center rounded mb-6 text-2xl">🧠</div>
              <h3 className="text-[18px] font-bold text-[#000000] mb-3">Semantic SEO Engine</h3>
              <p className="text-[14px] leading-[1.8] text-[#585858]">Maintains your exact core entities and search intent while injecting LSI keywords to guarantee higher rankings on Google.</p>
            </div>

            <div className="p-8 rounded-lg bg-[#fafbfe] border border-[#f1f1f1] hover:border-[#03d665] transition-colors">
              <div className="w-12 h-12 bg-[#e1fff7] text-[#03d665] flex items-center justify-center rounded mb-6 text-2xl">🛡️</div>
              <h3 className="text-[18px] font-bold text-[#000000] mb-3">Pass AI Detection</h3>
              <p className="text-[14px] leading-[1.8] text-[#585858]">Automatically adds natural burstiness and perplexity to your text, securing 99% human scores on top detectors like Originality.ai.</p>
            </div>

            <div className="p-8 rounded-lg bg-[#fafbfe] border border-[#f1f1f1] hover:border-[#03d665] transition-colors">
              <div className="w-12 h-12 bg-[#e1fff7] text-[#03d665] flex items-center justify-center rounded mb-6 text-2xl">⚡</div>
              <h3 className="text-[18px] font-bold text-[#000000] mb-3">Bulk & Fast Generation</h3>
              <p className="text-[14px] leading-[1.8] text-[#585858]">Generate up to 4 distinct, highly creative variations of your article in under 5 seconds. Scale your content production instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How it Works */}
      <section id="how-it-works" className="py-24 bg-[#fafbfe] border-y border-[#f1f1f1]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#000000] mb-4">How it works</h2>
            <p className="text-[16px] text-[#585858]">Get publish-ready content in three simple steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 mx-auto bg-white border-2 border-[#03d665] text-[#03d665] flex items-center justify-center rounded-full text-xl font-bold mb-6 shadow-sm">1</div>
              <h4 className="text-[18px] font-bold text-[#000000] mb-2">Paste Your Content</h4>
              <p className="text-[14px] text-[#585858]">Simply paste the article you want to rewrite into our clean, distraction-free editor.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-white border-2 border-[#03d665] text-[#03d665] flex items-center justify-center rounded-full text-xl font-bold mb-6 shadow-sm">2</div>
              <h4 className="text-[18px] font-bold text-[#000000] mb-2">Select Your Settings</h4>
              <p className="text-[14px] text-[#585858]">Choose how adventurous you want the AI to be and select how many variations you need.</p>
            </div>
            <div>
              <div className="w-16 h-16 mx-auto bg-white border-2 border-[#03d665] text-[#03d665] flex items-center justify-center rounded-full text-xl font-bold mb-6 shadow-sm">3</div>
              <h4 className="text-[18px] font-bold text-[#000000] mb-2">Click Rewrite</h4>
              <p className="text-[14px] text-[#585858]">Within seconds, get highly readable, unique, and SEO-optimized content ready to publish.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#000000] mb-6">Ready to scale your content strategy?</h2>
          <p className="text-[16px] text-[#585858] mb-10">Join thousands of SEOs, marketers, and writers who trust WordAi to produce high-quality content at scale.</p>
          <Link 
            href="/dashboard" 
            className="inline-block px-12 py-4 bg-[#03d665] hover:bg-[#02a64e] text-white text-[16px] font-bold rounded transition-all shadow-md"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* 7. Premium Footer */}
      <footer className="bg-[#01041b] text-[#ccced2] py-16 border-t border-[#f1f1f1]">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
          
          <div className="col-span-1 md:col-span-1">
            <div className="text-[26px] font-bold tracking-tight text-white mb-6">
              Word<span className="text-[#03d665]">Ai</span>
            </div>
            <p className="text-[13px] leading-relaxed mb-6 opacity-80">
              The smartest artificial intelligence text rewriter. We use advanced machine learning models to rewrite your content so it is indistinguishable from human writing.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-[15px]">Product</h4>
            <ul className="space-y-4 text-[14px]">
              <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">API Integration</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Avoid AI Detection</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-[15px]">Resources</h4>
            <ul className="space-y-4 text-[14px]">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Affiliate Program</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-[15px]">Legal</h4>
            <ul className="space-y-4 text-[14px]">
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="max-w-[1200px] mx-auto px-6 mt-16 pt-8 border-t border-[#343a40] text-[13px] text-center opacity-60">
          © {new Date().getFullYear()} WordAi. All rights reserved. Built with passion for content creators.
        </div>
      </footer>

    </div>
  );
}