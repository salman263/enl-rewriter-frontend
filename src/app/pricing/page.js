"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🚀 ডেটাবেস থেকে ডায়নামিক প্ল্যান নিয়ে আসা
  useEffect(() => {
    fetch("https://enl-rewriter-backend.onrender.com/api/plans")
      .then((res) => res.json())
      .then((data) => {
        if (data.plans) setPlans(data.plans);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpgrade = async (planName, credits) => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    try {
      const res = await fetch("https://enl-rewriter-backend.onrender.com/api/admin/upgrade-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, plan: planName, credits: credits }),
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
      <header className="h-[75px] bg-white border-b border-[#f1f1f1] flex items-center justify-between px-8 z-10 shadow-sm">
        <div className="flex items-center cursor-pointer" onClick={() => router.push("/dashboard")}>
          <div className="text-[24px] font-extrabold text-[#000000]">ZeroWord<span className="text-[#03d665]">Ai</span></div>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push("/dashboard")} className="text-sm font-medium hover:text-[#03d665] transition">Dashboard</button>
          {user ? <UserButton afterSignOutUrl="/" /> : <button onClick={() => router.push("/sign-in")} className="px-4 py-2 bg-[#03d665] text-white text-sm font-medium rounded-lg hover:bg-[#02a64e] transition">Sign In</button>}
        </div>
      </header>

      <div className="flex-1 py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-[#000000] mb-4 tracking-tight">Simple, transparent pricing</h1>
          <p className="text-[#585858] text-base">Choose the ideal plan to scale your content writing.</p>
        </div>

        {loading ? (
          <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#03d665]"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div key={idx} className={`bg-white p-8 rounded-2xl shadow-sm border ${plan.price > 0 ? 'border-2 border-[#03d665] relative md:-translate-y-2 shadow-[0_10px_30px_0_rgba(3,214,101,0.1)]' : 'border-[#f1f1f1] hover:border-[#e1e1e1]'} flex flex-col justify-between transition`}>
                {plan.price > 0 && <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#03d665] text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">Premium</span>}
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-[#585858] mb-2">{plan.name}</div>
                  <p className="text-4xl font-extrabold text-[#000000] mb-6 mt-4">${plan.price} <span className="text-sm font-normal text-[#585858]">{plan.price > 0 ? '/month' : '/forever'}</span></p>
                  <ul className="text-left text-[#585858] space-y-4 mb-8 text-sm border-t border-[#f1f1f1] pt-6">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">✅ <span className="text-[#000000] font-medium">{feature}</span></li>
                    ))}
                  </ul>
                </div>
                <button 
                  onClick={() => plan.price === 0 ? router.push("/dashboard") : handleUpgrade(plan.name, plan.credits)}
                  className={`w-full py-3 font-bold rounded-xl transition ${plan.price > 0 ? 'bg-[#03d665] text-white hover:bg-[#02a64e]' : 'bg-[#fafbfe] border border-[#e1e1e1] text-[#000000] hover:bg-[#f1f1f1]'}`}
                >
                  {plan.price === 0 ? "Get Started" : `Upgrade to ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}