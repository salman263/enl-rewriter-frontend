import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafbfe] text-[#585858] font-sans selection:bg-[#03d665] selection:text-white">
      
      {/* Navbar */}
      <header className="h-[80px] bg-white border-b border-[#f1f1f1] flex items-center justify-between px-8 md:px-16 sticky top-0 z-50 shadow-sm">
        <div className="text-[26px] font-bold tracking-tight text-[#000000]">
          Word<span className="text-[#03d665]">Ai</span> <span className="text-[14px] font-normal text-gray-400">Pro</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium">
          <a href="#features" className="hover:text-[#03d665] transition-colors">Features</a>
          <a href="#pricing" className="hover:text-[#03d665] transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="font-medium hover:text-[#03d665] transition-colors">Login</Link>
          <Link 
            href="/dashboard" 
            className="px-5 py-2.5 bg-[#03d665] hover:bg-[#02a64e] text-white font-medium rounded-lg transition-colors shadow-md"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-[1200px] mx-auto px-6 py-20 text-center">
        <div className="inline-block px-4 py-1.5 bg-[#e1fff7] text-[#03d665] font-semibold rounded-full text-sm mb-6 border border-[#b4f0dc]">
          ✨ The Ultimate Semantic SEO Rewriter
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-[#000000] tracking-tight leading-tight mb-6">
          Rewrite Content That <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#03d665] to-[#02a64e]">
            Ranks & Bypasses AI.
          </span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-500 leading-relaxed">
          Transform ordinary text into highly engaging, human-like content optimized for Search Engines. Bypass AI detectors with a single click.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto px-8 py-4 bg-[#03d665] hover:bg-[#02a64e] text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Rewriting Now 🚀
          </Link>
          <Link 
            href="#demo" 
            className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-[#f1f1f1] hover:border-[#03d665] text-[#585858] hover:text-[#03d665] text-lg font-bold rounded-xl transition-all shadow-sm"
          >
            See How it Works
          </Link>
        </div>
        
        <div className="mt-12 text-sm font-medium text-gray-400">
          No credit card required • 5 Free credits to start
        </div>
      </main>

      {/* Features Preview Section */}
      <section id="features" className="bg-white py-20 border-t border-[#f1f1f1]">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div className="p-8 rounded-2xl bg-[#fafbfe] border border-[#f1f1f1] hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-[#e1fff7] text-[#03d665] flex items-center justify-center rounded-xl text-3xl mb-6">🧠</div>
            <h3 className="text-xl font-bold text-[#000000] mb-3">Semantic SEO Engine</h3>
            <p className="text-gray-500">Preserves core entities and search intent while automatically injecting LSI keywords to boost your Google rankings.</p>
          </div>

          <div className="p-8 rounded-2xl bg-[#fafbfe] border border-[#f1f1f1] hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-[#e1fff7] text-[#03d665] flex items-center justify-center rounded-xl text-3xl mb-6">🛡️</div>
            <h3 className="text-xl font-bold text-[#000000] mb-3">AI Detection Bypass</h3>
            <p className="text-gray-500">Adds natural burstiness and perplexity to your text, ensuring a 99% human score on Originality.ai and Turnitin.</p>
          </div>

          <div className="p-8 rounded-2xl bg-[#fafbfe] border border-[#f1f1f1] hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-[#e1fff7] text-[#03d665] flex items-center justify-center rounded-xl text-3xl mb-6">⚡</div>
            <h3 className="text-xl font-bold text-[#000000] mb-3">Lightning Fast</h3>
            <p className="text-gray-500">Generate up to 4 unique, human-like variations of your content in mere seconds.</p>
          </div>

        </div>
      </section>

    </div>
  );
}