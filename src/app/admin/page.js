"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// 🚨 এখানে আপনার ইমেইল দিন
const ADMIN_EMAIL = "seotoolshero@gmail.com"; 

export default function AdminDashboard() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("users"); 
  const [loading, setLoading] = useState(true);
  
  const [usersList, setUsersList] = useState([]);
  const [plansList, setPlansList] = useState([]);
  const [couponsList, setCouponsList] = useState([]); 
  const [analytics, setAnalytics] = useState({ total_users: 0, total_rewrites: 0, total_words_processed: 0 });
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [editPlan, setEditPlan] = useState("Starter");
  const [editSeoWords, setEditSeoWords] = useState(0);
  const [editBypassWords, setEditBypassWords] = useState(0);
  const [isBanned, setIsBanned] = useState(false);

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planForm, setPlanForm] = useState({ planId: "", name: "", price: 0, seo_words: 0, bypass_words: 0, features: "", sort_order: 1, duration_days: 30 });

  const [genCouponCount, setGenCouponCount] = useState(10);
  const [genCouponPlan, setGenCouponPlan] = useState("");
  const [genCouponPrefix, setGenCouponPrefix] = useState("SUMO");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resUsers, resPlans, resAnalytics, resCoupons] = await Promise.all([
        fetch("https://enl-rewriter-backend.onrender.com/api/admin/users").then(r => r.json()),
        fetch("https://enl-rewriter-backend.onrender.com/api/plans").then(r => r.json()),
        fetch("https://enl-rewriter-backend.onrender.com/api/admin/analytics").then(r => r.json()),
        fetch("https://enl-rewriter-backend.onrender.com/api/admin/coupons").then(r => r.json())
      ]);
      setUsersList(resUsers.users || []);
      setPlansList(resPlans.plans || []);
      setAnalytics(resAnalytics);
      setCouponsList(resCoupons.coupons || []);
      if(resPlans.plans && resPlans.plans.length > 0) setGenCouponPlan(resPlans.plans[0].name);
    } catch (err) { 
      console.error("Error fetching data"); 
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isLoaded) {
      if (!user) router.push("/sign-in");
      else if (user.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) router.push("/dashboard");
      else fetchData();
    }
  }, [isLoaded, user, router]);

  // --- COUPON ACTIONS ---
  const handleGenerateCoupons = async () => {
    if (!genCouponPlan) return alert("Select a plan first!");
    try {
      await fetch("https://enl-rewriter-backend.onrender.com/api/admin/generate-coupons", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_name: genCouponPlan, count: genCouponCount, prefix: genCouponPrefix }),
      });
      alert(`Successfully generated ${genCouponCount} coupons!`);
      fetchData();
    } catch (err) { alert("Failed to generate coupons"); }
  };

  // 🚀 NEW: Delete Single Coupon
  const handleDeleteCoupon = async (code) => {
    if (!window.confirm(`Are you sure you want to delete coupon: ${code}?`)) return;
    try {
      await fetch(`https://enl-rewriter-backend.onrender.com/api/admin/coupons/${code}`, { method: "DELETE" });
      fetchData();
    } catch (err) { alert("Failed to delete coupon"); }
  };

  // 🚀 NEW: Bulk Delete Coupons
  const handleBulkDeleteCoupons = async () => {
    if (!window.confirm("🚨 WARNING: Are you sure you want to DELETE ALL COUPONS? This cannot be undone!")) return;
    try {
      await fetch("https://enl-rewriter-backend.onrender.com/api/admin/coupons-bulk", { method: "DELETE" });
      alert("All coupons deleted successfully!");
      fetchData();
    } catch (err) { alert("Failed to delete coupons"); }
  };

  // --- USER ACTIONS ---
  const handleQuickBan = async (u) => {
    const action = u.banned ? "UNBAN" : "BAN";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      await fetch("https://enl-rewriter-backend.onrender.com/api/admin/super-update", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: u.userId, plan: u.plan, seo_words: u.seo_words, bypass_words: u.bypass_words, banned: !u.banned }) 
      });
      fetchData();
    } catch (err) { alert("Failed to update ban status"); }
  };

  const handleSaveUser = async () => {
    try {
      await fetch("https://enl-rewriter-backend.onrender.com/api/admin/super-update", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.userId, plan: editPlan, seo_words: parseInt(editSeoWords), bypass_words: parseInt(editBypassWords), banned: isBanned }),
      });
      alert("User updated successfully!");
      setSelectedUser(null);
      fetchData();
    } catch (err) { alert("Update failed!"); }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm("Delete this user permanently?")) return;
    await fetch(`https://enl-rewriter-backend.onrender.com/api/admin/delete-user/${selectedUser.userId}`, { method: "DELETE" });
    setSelectedUser(null);
    fetchData();
  };

  // --- PLAN ACTIONS ---
  const handleSavePlan = async () => {
    try {
      const generatedPlanId = planForm.planId || planForm.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000);
      const featureArray = planForm.features.split(",").map(f => f.trim()).filter(f => f);
      const payload = { ...planForm, planId: generatedPlanId, features: featureArray };
      await fetch("https://enl-rewriter-backend.onrender.com/api/admin/plans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setShowPlanModal(false);
      fetchData();
    } catch (err) { alert("Failed to save plan"); }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Delete this plan?")) return;
    await fetch(`https://enl-rewriter-backend.onrender.com/api/admin/plans/${planId}`, { method: "DELETE" });
    fetchData();
  };

  const openNewPlanModal = () => { setPlanForm({ planId: "", name: "", price: 0, seo_words: 0, bypass_words: 0, features: "", sort_order: plansList.length + 1, duration_days: 30 }); setShowPlanModal(true); };
  const openEditPlanModal = (p) => { setPlanForm({ planId: p.planId, name: p.name, price: p.price, seo_words: p.seo_words, bypass_words: p.bypass_words, features: p.features ? p.features.join(", ") : "", sort_order: p.sort_order || 99, duration_days: p.duration_days || 30 }); setShowPlanModal(true); };
  
  const handlePlanChange = (e) => {
    setEditPlan(e.target.value);
    const matchedPlan = plansList.find(p => p.name === e.target.value);
    if (matchedPlan) {
      setEditSeoWords(matchedPlan.seo_words);
      setEditBypassWords(matchedPlan.bypass_words);
    }
  };

  if (!isLoaded || loading) return <div className="flex h-screen justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#03d665]"></div></div>;

  return (
    <div className="min-h-screen bg-[#fafbfe] text-[#585858] font-sans flex flex-col">
      <header className="h-[75px] bg-white border-b border-[#f1f1f1] flex items-center justify-between px-8 z-10">
        <div className="text-[22px] font-extrabold text-[#000]">ZeroWord<span className="text-[#03d665]">Ai</span> <span className="text-xs bg-black text-white px-2 py-0.5 rounded uppercase ml-2">Admin</span></div>
        <button onClick={() => router.push("/dashboard")} className="text-sm font-bold bg-[#f1f1f1] px-4 py-2 rounded-lg text-[#000]">Exit</button>
      </header>

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR */}
        <div className="w-full md:w-[250px] bg-white rounded-2xl border border-[#f1f1f1] p-4 h-fit">
          <button onClick={() => setActiveTab("users")} className={`w-full text-left px-4 py-3 rounded-xl font-bold mb-2 ${activeTab === "users" ? "bg-[#03d665] text-white" : "hover:bg-[#f1f1f1]"}`}>👥 Users</button>
          <button onClick={() => setActiveTab("plans")} className={`w-full text-left px-4 py-3 rounded-xl font-bold mb-2 ${activeTab === "plans" ? "bg-[#03d665] text-white" : "hover:bg-[#f1f1f1]"}`}>💳 Plans</button>
          <button onClick={() => setActiveTab("coupons")} className={`w-full text-left px-4 py-3 rounded-xl font-bold mb-2 ${activeTab === "coupons" ? "bg-[#03d665] text-white" : "hover:bg-[#f1f1f1]"}`}>🎁 Coupons</button>
          <button onClick={() => setActiveTab("analytics")} className={`w-full text-left px-4 py-3 rounded-xl font-bold ${activeTab === "analytics" ? "bg-[#03d665] text-white" : "hover:bg-[#f1f1f1]"}`}>📊 Analytics</button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1">
          
          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="bg-white rounded-2xl border border-[#f1f1f1] overflow-hidden">
              <div className="p-6 border-b border-[#f1f1f1]"><h3 className="font-bold text-lg text-[#000]">Registered Users ({usersList.length})</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#fafbfe] text-xs uppercase tracking-wider border-b border-[#f1f1f1]">
                      <th className="p-4 pl-6">User Info</th>
                      <th className="p-4">Plan</th>
                      <th className="p-4">Limits</th>
                      <th className="p-4 pr-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-[#f1f1f1]">
                    {usersList.map((u, i) => (
                      <tr key={i} className={`hover:bg-[#fafbfe] ${u.banned ? 'bg-red-50' : ''}`}>
                        <td className="p-4 pl-6">
                          <div className="font-bold text-black">{u.email || "Pending Login Sync"}</div>
                          <div className="font-mono text-[10px] text-gray-400">{u.userId}</div>
                        </td>
                        <td className="p-4 font-bold">{u.plan || "Starter"}</td>
                        <td className="p-4">
                          <div className="text-xs font-bold text-blue-500">SEO: {u.seo_words}</div>
                          <div className="text-xs font-bold text-[#03d665]">Bypass: {u.bypass_words}</div>
                        </td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          <button onClick={() => handleQuickBan(u)} className={`px-3 py-1.5 text-xs font-bold rounded border ${u.banned ? 'bg-white text-green-600 border-green-600' : 'bg-red-50 text-red-600 border-red-200'}`}>{u.banned ? 'Unban' : 'Ban'}</button>
                          <button onClick={() => { setSelectedUser(u); setEditPlan(u.plan||"Starter"); setEditSeoWords(u.seo_words||0); setEditBypassWords(u.bypass_words||0); setIsBanned(u.banned||false); }} className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded">Manage</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PLANS TAB */}
          {activeTab === "plans" && (
            <div className="bg-white rounded-2xl border border-[#f1f1f1] overflow-hidden">
              <div className="p-6 border-b border-[#f1f1f1] flex justify-between items-center bg-[#fafbfe]">
                <h3 className="font-bold text-lg text-[#000]">Manage Plans</h3>
                <button onClick={openNewPlanModal} className="px-4 py-2 bg-[#03d665] text-white text-sm font-bold rounded-lg">+ New Plan</button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {plansList.map((p, i) => (
                  <div key={i} className="border-2 border-[#f1f1f1] p-6 rounded-xl relative">
                    <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded">Pos: {p.sort_order || 99}</div>
                    <h4 className="text-xl font-extrabold text-[#000]">{p.name}</h4>
                    <p className="text-[#03d665] font-bold text-2xl my-2">${p.price} <span className="text-sm font-medium text-gray-400">/ {p.duration_days == 0 ? "Lifetime" : p.duration_days + " Days"}</span></p>
                    <div className="bg-[#fafbfe] p-3 rounded-lg text-sm font-bold text-[#585858] mb-4 mt-2">
                      <div>SEO Words: <span className="text-blue-500">{p.seo_words}</span></div>
                      <div>Bypass Words: <span className="text-[#03d665]">{p.bypass_words}</span></div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => openEditPlanModal(p)} className="flex-1 py-1.5 bg-black text-white text-xs font-bold rounded">Edit</button>
                      <button onClick={() => handleDeletePlan(p.planId)} className="px-4 py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COUPONS TAB */}
          {activeTab === "coupons" && (
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl border border-[#f1f1f1] p-6 shadow-sm">
                <h3 className="font-bold text-lg text-[#000] mb-4">Generate Promo Codes</h3>
                <div className="flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Select Plan</label>
                    <select value={genCouponPlan} onChange={e => setGenCouponPlan(e.target.value)} className="border-2 p-2 rounded outline-none font-bold text-black min-w-[200px]">
                      {plansList.map(p => <option key={p.planId} value={p.name}>{p.name} ({p.duration_days == 0 ? "Lifetime" : p.duration_days + " Days"})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Prefix</label>
                    <input type="text" value={genCouponPrefix} onChange={e => setGenCouponPrefix(e.target.value)} className="border-2 p-2 rounded outline-none font-bold text-black w-[100px] text-center" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Quantity</label>
                    <input type="number" value={genCouponCount} onChange={e => setGenCouponCount(parseInt(e.target.value))} className="border-2 p-2 rounded outline-none font-bold text-black w-[100px] text-center" />
                  </div>
                  <button onClick={handleGenerateCoupons} className="bg-black text-white px-6 py-2.5 rounded font-bold shadow-md hover:bg-gray-800">Generate</button>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-[#f1f1f1] overflow-hidden">
                <div className="p-6 border-b border-[#f1f1f1] flex justify-between items-center bg-[#fafbfe]">
                  <h3 className="font-bold text-lg text-[#000]">All Codes ({couponsList.length})</h3>
                  
                  {/* 🚀 BULK DELETE BUTTON */}
                  {couponsList.length > 0 && (
                    <button onClick={handleBulkDeleteCoupons} className="px-4 py-2 bg-red-100 text-red-600 text-xs font-bold rounded hover:bg-red-200 transition">
                      🗑️ Delete All Coupons
                    </button>
                  )}
                </div>
                
                <div className="max-h-[500px] overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {couponsList.map((c, i) => (
                    <div key={i} className={`p-4 rounded-xl border relative ${c.is_used ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'}`}>
                      
                      {/* 🚀 SINGLE DELETE BUTTON */}
                      <button onClick={() => handleDeleteCoupon(c.code)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 font-bold text-lg leading-none" title="Delete Coupon">
                        &times;
                      </button>

                      <div className="font-mono font-bold text-lg text-black tracking-wider mb-1 pr-6">{c.code}</div>
                      <div className="text-xs font-bold text-gray-500 mb-2">Plan: <span className="text-black">{c.plan_name}</span> ({c.duration_days == 0 ? "Lifetime" : c.duration_days + " Days"})</div>
                      {c.is_used ? (
                        <div className="text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded inline-block font-bold">USED</div>
                      ) : (
                        <div className="text-[10px] bg-[#03d665] text-white px-2 py-1 rounded inline-block font-bold">ACTIVE</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === "analytics" && (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-2xl border border-[#f1f1f1] shadow-sm"><div className="text-sm font-bold">Total Rewrites</div><div className="text-3xl font-extrabold text-[#03d665] mt-2">{analytics.total_rewrites}</div></div>
               <div className="bg-white p-6 rounded-2xl border border-[#f1f1f1] shadow-sm"><div className="text-sm font-bold">Total Words Processed</div><div className="text-3xl font-extrabold text-blue-500 mt-2">{analytics.total_words_processed}</div></div>
             </div>
          )}
        </div>
      </div>

      {/* PLAN MODAL */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-[500px] rounded-2xl shadow-2xl p-6">
            <h2 className="text-lg font-extrabold text-[#000] mb-4">{planForm.planId ? "Edit Plan" : "Create Plan"}</h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div><label className="text-xs font-bold uppercase block mb-1">Plan Name</label><input type="text" value={planForm.name} onChange={e=>setPlanForm({...planForm, name: e.target.value})} className="w-full border-2 p-2 rounded outline-none font-bold text-black" /></div>
              
              <div className="flex gap-4">
                <div className="flex-1"><label className="text-xs font-bold uppercase block mb-1">Price ($)</label><input type="number" value={planForm.price} onChange={e=>setPlanForm({...planForm, price: parseInt(e.target.value)})} className="w-full border-2 p-2 rounded outline-none font-bold text-black" /></div>
                <div className="flex-1"><label className="text-xs font-bold uppercase block mb-1 text-purple-600">Validity (Days, 0=Life)</label><input type="number" value={planForm.duration_days} onChange={e=>setPlanForm({...planForm, duration_days: parseInt(e.target.value)})} className="w-full border-2 border-purple-200 p-2 rounded outline-none font-bold text-black focus:border-purple-500" /></div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-3">
                 <div><label className="text-xs font-bold uppercase text-blue-600 block mb-1">SEO Words/Month</label><input type="number" value={planForm.seo_words} onChange={e=>setPlanForm({...planForm, seo_words: parseInt(e.target.value)})} className="w-full border p-2 rounded outline-none font-bold text-black" /></div>
                 <div><label className="text-xs font-bold uppercase text-[#03d665] block mb-1">Bypass Words/Month</label><input type="number" value={planForm.bypass_words} onChange={e=>setPlanForm({...planForm, bypass_words: parseInt(e.target.value)})} className="w-full border p-2 rounded outline-none font-bold text-black" /></div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase block mb-1 text-black">Features (Comma Separated)</label>
                <textarea value={planForm.features} onChange={e=>setPlanForm({...planForm, features: e.target.value})} className="w-full border-2 p-3 rounded outline-none font-medium h-[60px] text-sm text-black" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[#f1f1f1]">
              <button onClick={() => setShowPlanModal(false)} className="px-4 py-2 bg-gray-200 rounded font-bold">Cancel</button>
              <button onClick={handleSavePlan} className="px-6 py-2 bg-[#03d665] text-white rounded font-bold">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* USER EDIT MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-2xl shadow-2xl p-6">
            <h2 className="text-lg font-extrabold text-[#000] mb-4">Manage: {selectedUser.email || selectedUser.userId}</h2>
            <div className="flex gap-4 mb-4">
              <div className="flex-1"><label className="text-xs font-bold uppercase">Plan</label>
                <select value={editPlan} onChange={handlePlanChange} className="w-full border-2 p-2.5 rounded-xl font-bold">
                  {plansList.map(p => <option key={p.planId} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div className="flex-1"><label className="text-xs font-bold uppercase">Status</label>
                <button onClick={() => setIsBanned(!isBanned)} className={`w-full p-2.5 rounded-xl font-bold border-2 ${isBanned ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{isBanned ? '🚫 BANNED' : '✅ ACTIVE'}</button>
              </div>
            </div>
            <div className="bg-[#f8f9fc] p-4 rounded-xl border flex gap-4 items-center mb-6">
              <div className="flex-1"><span className="text-[10px] uppercase font-bold text-blue-500">SEO Words</span><input type="number" value={editSeoWords} onChange={e => setEditSeoWords(e.target.value)} className="w-full border-2 p-2 rounded-lg font-bold text-center text-black" /></div>
              <div className="flex-1"><span className="text-[10px] uppercase font-bold text-[#03d665]">Bypass Words</span><input type="number" value={editBypassWords} onChange={e => setEditBypassWords(e.target.value)} className="w-full border-2 p-2 rounded-lg font-bold text-center text-black" /></div>
            </div>
            <div className="flex justify-between items-center">
              <button onClick={handleDeleteUser} className="text-red-500 font-bold text-sm underline">Delete User</button>
              <div className="flex gap-3"><button onClick={() => setSelectedUser(null)} className="px-5 py-2 bg-gray-200 rounded-xl font-bold text-black">Cancel</button><button onClick={handleSaveUser} className="px-6 py-2 bg-[#03d665] text-white rounded-xl font-bold">Save</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}