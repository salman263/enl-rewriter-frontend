"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://enl-rewriter-backend.onrender.com/api/plans")
      .then((res) => res.json())
      .then((data) => {
        if (data.plans) setPlans(data.plans);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load plans:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#fafbfe] text-[#585858] font-sans flex flex-col">
      <header className="h-[75px] bg-white border-b border-[#f1f1f1] flex items-center justify-between px-8 z-10 shadow-sm">
        <div className="flex items-center cursor-pointer" onClick={() => router.push("/dashboard")}>
          <div className="text-[24px] font-extrabold text-[#000000]">ZeroWord<span className="text-[#03d665]">Ai</span></div>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push("/dashboard")} className="text-sm font-medium hover:text-[#03d665] transition">Dashboard</button>
          {user ? <UserButton afterSignOutUrl="/" /> : <button onClick={() => router.push("/sign-in")} className="px-4 py-2 bg-[#03d665] text-white text-sm font-medium rounded-lg hover:bg-[#02a64e]">Sign In</button>}
        </div>
      </header>

      <div className="flex-1 py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-[#000000] mb-4 tracking-tight">Simple, transparent pricing</h1>
          <p className="text-[#585858] text-base">Choose the ideal plan to scale your content writing.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[200px]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#03d665]"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => {
              // 🛡️ Crash-Proof Logic
              const planName = plan.name || "Unknown Plan";
              const isEnterprise = planName.toLowerCase().includes("enterprise");
              const seoWords = plan.seo_words || 0;
              const bypassWords = plan.bypass_words || 0;
              const price = plan.price || 0;
              const features = plan.features || [];

              return (
                <div key={idx} className={`bg-white p-8 rounded-2xl shadow-lg border flex flex-col justify-between transition hover:border-[#03d665] ${price > 0 && price < 99 ? 'border-2 border-[#03d665] relative md:-translate-y-2' : 'border-[#f1f1f1]'}`}>
                  
                  {price > 0 && price < 99 && <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#03d665] text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">Most Popular</span>}
                  
                  <div>
                    <h3 className="text-2xl font-extrabold text-[#000000] mb-2">{planName}</h3>
                    <p className="text-4xl font-extrabold text-[#000000] mb-6">
                      {price === 0 && isEnterprise ? "Custom" : `$${price}`}
                      {price > 0 && <span className="text-sm font-normal text-[#585858]">/month</span>}
                    </p>
                    
                    <div className="bg-[#fafbfe] p-4 rounded-xl border border-[#f1f1f1] mb-6 space-y-2">
                      <div className="text-sm font-bold text-blue-600">
                        {price === 0 && isEnterprise ? "Custom Rewrite Words/Mo" : `${seoWords.toLocaleString()} Rewrite Words/Mo`}
                      </div>
                      <div className="text-sm font-bold text-[#03d665]">
                        {price === 0 && isEnterprise ? "Custom Pass AI Detection Words/Mo" : `${bypassWords.toLocaleString()} Pass AI Detection Words/Mo`}
                      </div>
                    </div>
                    
                    <ul className="text-left text-[#585858] space-y-3 mb-8 text-sm">
                      {features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <span className="text-[#03d665] mt-0.5">✓</span> <span className="text-[#000000] font-medium leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className={`w-full py-3 font-bold rounded-xl transition ${price > 0 && price < 99 ? 'bg-[#03d665] text-white hover:bg-[#02a64e] shadow-md' : 'bg-black text-white hover:bg-gray-800'}`}>
                    {isEnterprise ? "Contact Us" : "Get Started"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <footer className="py-6 border-t border-[#f1f1f1] text-center text-xs text-[#585858]">© 2026 ZeroWordAi. All rights reserved.</footer>
    </div>
  );
}