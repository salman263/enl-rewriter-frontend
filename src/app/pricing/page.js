"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const { user } = useUser();
  const router = useRouter();

  const handleUpgrade = async (planName, credits) => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    try {
      const res = await fetch("https://enl-rewriter-backend.onrender.com/api/admin/upgrade-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          plan: planName,
          credits: credits
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Successfully upgraded to ${planName}!`);
        router.push("/dashboard");
      } else {
        alert("Failed to upgrade plan.");
      }
    } catch (err) {
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfe] text-[#585858] font-sans flex flex-col">
      
      {/* Professional Header */}
      <header className="h-[75px] bg-white border-b border-[#f1f1f1] flex items-center justify-between px-8 z-10 shadow-sm">
        <div className="flex items-center cursor-pointer" onClick={() => router.push("/dashboard")}>
          <div className="text-[24px] font-extrabold text-[#000000]">
            ZeroWord<span className="text-[#03d665]">Ai</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.push("/dashboard")}
            className="text-sm font-medium hover:text-[#03d665] transition"
          >
            Dashboard
          </button>
          {user ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <button 
              onClick={() => router.push("/sign-in")}
              className="px-4 py-2 bg-[#03d665] text-white text-sm font-medium rounded-lg hover:bg-[#02a64e] transition"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Pricing Content */}
      <div className="flex-1 py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-[#000000] mb-4 tracking-tight">
            Simple, transparent pricing for <span className="text-[#03d665]">everyone</span>
          </h1>
          <p className="text-[#585858] text-base">
            Choose the ideal plan to scale your content writing and completely bypass AI detectors effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] border border-[#f1f1f1] flex flex-col justify-between hover:border-[#e1e1e1] transition">
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-[#585858] mb-2">Starter</div>
              <h3 className="text-2xl font-extrabold text-[#000000] mb-1">Free Plan</h3>
              <p className="text-4xl font-extrabold text-[#000000] mb-6 mt-4">$0 <span className="text-sm font-normal text-[#585858]">/forever</span></p>
              <ul className="text-left text-[#585858] space-y-4 mb-8 text-sm border-t border-[#f1f1f1] pt-6">
                <li className="flex items-center gap-2">✅ <span className="text-[#000000] font-medium">5 Free Credits</span></li>
                <li className="flex items-center gap-2">✅ <span className="text-[#000000] font-medium">Semantic SEO Rewrite</span></li>
                <li className="flex items-center gap-2">✅ <span className="text-[#000000] font-medium">Basic AI Humanizer</span></li>
              </ul>
            </div>
            <button 
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 bg-[#fafbfe] border border-[#e1e1e1] text-[#000000] font-bold rounded-xl hover:bg-[#f1f1f1] transition"
            >
              Get Started
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_0_rgba(3,214,101,0.1)] border-2 border-[#03d665] flex flex-col justify-between relative transform md:-translate-y-2">
            <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#03d665] text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">Most Popular</span>
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-[#03d665] mb-2">Professional</div>
              <h3 className="text-2xl font-extrabold text-[#000000] mb-1">Pro Plan</h3>
              <p className="text-4xl font-extrabold text-[#000000] mb-6 mt-4">$19 <span className="text-sm font-normal text-[#585858]">/month</span></p>
              <ul className="text-left text-[#585858] space-y-4 mb-8 text-sm border-t border-[#f1f1f1] pt-6">
                <li className="flex items-center gap-2">🚀 <span className="text-[#000000] font-medium">100 Credits / month</span></li>
                <li className="flex items-center gap-2">🚀 <span className="text-[#000000] font-medium">Advanced AI Bypass</span></li>
                <li className="flex items-center gap-2">🚀 <span className="text-[#000000] font-medium">Priority Speed</span></li>
              </ul>
            </div>
            <button 
              onClick={() => handleUpgrade("Pro", 100)}
              className="w-full py-3 bg-[#03d665] text-white font-bold rounded-xl hover:bg-[#02a64e] shadow-md shadow-[#03d665]/20 transition"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] border border-[#f1f1f1] flex flex-col justify-between hover:border-[#e1e1e1] transition">
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-[#585858] mb-2">Business</div>
              <h3 className="text-2xl font-extrabold text-[#000000] mb-1">Enterprise</h3>
              <p className="text-4xl font-extrabold text-[#000000] mb-6 mt-4">$49 <span className="text-sm font-normal text-[#585858]">/month</span></p>
              <ul className="text-left text-[#585858] space-y-4 mb-8 text-sm border-t border-[#f1f1f1] pt-6">
                <li className="flex items-center gap-2">⭐ <span className="text-[#000000] font-medium">Unlimited Credits</span></li>
                <li className="flex items-center gap-2">⭐ <span className="text-[#000000] font-medium">Max Human Bypass</span></li>
                <li className="flex items-center gap-2">⭐ <span className="text-[#000000] font-medium">24/7 VIP Support</span></li>
              </ul>
            </div>
            <button 
              onClick={() => handleUpgrade("Enterprise", 9999)}
              className="w-full py-3 bg-[#000000] text-white font-bold rounded-xl hover:bg-[#333333] transition"
            >
              Go Enterprise
            </button>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-[#f1f1f1] text-center text-xs text-[#585858]">
        © 2026 ZeroWordAi. All rights reserved.
      </footer>
    </div>
  );
}