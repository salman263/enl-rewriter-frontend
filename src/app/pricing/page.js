"use client";

import { useUser } from "@clerk/nextjs";
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
    <div className="min-h-screen bg-[#fafbfe] py-16 px-6 font-sans">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-[#000000] mb-4">
          Flexible Plans for <span className="text-[#03d665]">Everyone</span>
        </h1>
        <p className="text-[#585858] mb-12 text-lg">
          Choose the right plan to boost your content creation and bypass AI detection.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#f1f1f1] flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#000000] mb-2">Free Plan</h3>
              <p className="text-3xl font-extrabold text-[#03d665] mb-6">$0 <span className="text-sm font-normal text-[#585858]">/forever</span></p>
              <ul className="text-left text-[#585858] space-y-3 mb-8 text-sm">
                <li>✅ 5 Free Credits</li>
                <li>✅ Standard SEO Rewrite</li>
                <li>✅ Basic Humanizer</li>
              </ul>
            </div>
            <button 
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 bg-[#f1f1f1] text-[#000000] font-bold rounded-lg hover:bg-[#e1e1e1] transition"
            >
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white p-8 rounded-2xl shadow-md border-2 border-[#03d665] flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#03d665] text-white text-xs px-3 py-1 rounded-full font-bold uppercase">Popular</span>
            <div>
              <h3 className="text-xl font-bold text-[#000000] mb-2">Pro Plan</h3>
              <p className="text-3xl font-extrabold text-[#03d665] mb-6">$19 <span className="text-sm font-normal text-[#585858]">/month</span></p>
              <ul className="text-left text-[#585858] space-y-3 mb-8 text-sm">
                <li>✅ 100 Credits / month</li>
                <li>✅ Advanced AI Humanizer</li>
                <li>✅ Priority Generation Speed</li>
              </ul>
            </div>
            <button 
              onClick={() => handleUpgrade("Pro", 100)}
              className="w-full py-3 bg-[#03d665] text-white font-bold rounded-lg hover:bg-[#02a64e] transition"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#f1f1f1] flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#000000] mb-2">Enterprise</h3>
              <p className="text-3xl font-extrabold text-[#03d665] mb-6">$49 <span className="text-sm font-normal text-[#585858]">/month</span></p>
              <ul className="text-left text-[#585858] space-y-3 mb-8 text-sm">
                <li>✅ Unlimited Credits</li>
                <li>✅ Max Human Bypass</li>
                <li>✅ 24/7 Dedicated Support</li>
              </ul>
            </div>
            <button 
              onClick={() => handleUpgrade("Enterprise", 9999)}
              className="w-full py-3 bg-[#000000] text-white font-bold rounded-lg hover:bg-[#333333] transition"
            >
              Go Enterprise
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}