"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// 🚨 এখানে আপনার নিজের ইমেইল দিন 🚨
const ADMIN_EMAIL = "seotoolshero@gmail.com"; 

export default function AdminDashboard() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [usersList, setUsersList] = useState([]);
  const [plansList, setPlansList] = useState([]);
  const [analytics, setAnalytics] = useState({ total_users: 0, total_rewrites: 0, active_database: "", ai_engine: "" });
  
  // User Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [editPlan, setEditPlan] = useState("Free");
  const [editCredits, setEditCredits] = useState(0);
  const [isBanned, setIsBanned] = useState(false);
  const [addCreditAmount, setAddCreditAmount] = useState("");

  // Plan Modal States
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planForm, setPlanForm] = useState({ planId: "", name: "", price: 0, credits: 0, features: "" });

  const fetchData = () => {
    // Fetch Users
    fetch("https://enl-rewriter-backend.onrender.com/api/admin/users").then(res => res.json()).then(data => setUsersList(data.users || []));
    // Fetch Plans
    fetch("https://enl-rewriter-backend.onrender.com/api/plans").then(res => res.json()).then(data => setPlansList(data.plans || []));
    // Fetch Analytics
    fetch("https://enl-rewriter-backend.onrender.com/api/admin/analytics").then(res => res.json()).then(data => setAnalytics(data));
    setLoading(false);
  };

  useEffect(() => {
    if (isLoaded) {
      if (!user) router.push("/sign-in");
      else if (user.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) {
        alert("Access Denied! Admin only.");
        router.push("/dashboard");
      } else {
        fetchData();
      }
    }
  }, [isLoaded, user, router]);

  // --- USER ACTIONS ---
  const handleSaveUser = async () => {
    try {
      const finalCredits = addCreditAmount ? parseInt(editCredits) + parseInt(addCreditAmount) : parseInt(editCredits);
      await fetch("https://enl-rewriter-backend.onrender.com/api/admin/super-update", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.userId, plan: editPlan, credits: finalCredits, banned: isBanned }),
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
      const featureArray = planForm.features.split(",").map(f => f.trim()).filter(f => f);
      const payload = { ...planForm, features: featureArray };
      await fetch("https://enl-rewriter-backend.onrender.com/api/admin/plans", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert("Plan saved!");
      setShowPlanModal(false);
      fetchData();
    } catch (err) { alert("Failed to save plan"); }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Delete this plan?")) return;
    await fetch(`https://enl-rewriter-backend.onrender.com/api/admin/plans/${planId}`, { method: "DELETE" });
    fetchData();
  };

  const openNewPlanModal = () => {
    setPlanForm({ planId: "", name: "", price: 0, credits: 0, features: "" });
    setShowPlanModal(true);
  };

  const openEditPlanModal = (p) => {
    setPlanForm({ planId: p.planId, name: p.name, price: p.price, credits: p.credits, features: p.features.join(", ") });
    setShowPlanModal(true);
  };

  if (!isLoaded || loading) return <div className="flex h-screen justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#03d665]"></div></div>;

  return (
    <div className="min-h-screen bg-[#fafbfe] text-[#585858] font-sans flex flex-col">
      <header className="h-[75px] bg-white border-b border-[#f1f1f1] flex items-center justify-between px-8 z-10 shadow-sm">
        <div className="text-[22px] font-extrabold text-[#000000]">ZeroWord<span className="text-[#03d665]">Ai</span> <span className="text-xs bg-black text-white px-2 py-0.5 rounded uppercase ml-2">Super Admin</span></div>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push("/dashboard")} className="text-sm font-bold bg-[#f1f1f1] px-4 py-2 rounded-lg text-[#000000]">Exit</button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-[250px] bg-white rounded-2xl border border-[#f1f1f1] shadow-sm p-4 h-fit">
          <button onClick={() => setActiveTab("users")} className={`w-full text-left px-4 py-3 rounded-xl font-bold mb-2 ${activeTab === "users" ? "bg-[#03d665] text-white" : "hover:bg-[#f1f1f1] text-[#000]"}`}>👥 Users</button>
          <button onClick={() => setActiveTab("plans")} className={`w-full text-left px-4 py-3 rounded-xl font-bold mb-2 ${activeTab === "plans" ? "bg-[#03d665] text-white" : "hover:bg-[#f1f1f1] text-[#000]"}`}>💳 Plans</button>
          <button onClick={() => setActiveTab("analytics")} className={`w-full text-left px-4 py-3 rounded-xl font-bold ${activeTab === "analytics" ? "bg-[#03d665] text-white" : "hover:bg-[#f1f1f1] text-[#000]"}`}>📊 Analytics</button>
        </div>

        {/* Content */}
        <div className="flex-1">
          
          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="bg-white rounded-2xl border border-[#f1f1f1] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#f1f1f1]"><h3 className="font-bold text-lg text-[#000]">Total Users: {usersList.length}</h3></div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white text-xs uppercase tracking-wider border-b border-[#f1f1f1]">
                      <th className="p-4">User ID</th><th className="p-4">Status</th><th className="p-4">Plan</th><th className="p-4">Credits</th><th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-[#f1f1f1]">
                    {usersList.map((u, idx) => (
                      <tr key={idx} className="hover:bg-[#fafbfe]">
                        <td className="p-4 font-mono text-xs font-bold text-[#000]">{u.userId}</td>
                        <td className="p-4">{u.banned ? <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-bold">BANNED</span> : <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">ACTIVE</span>}</td>
                        <td className="p-4 font-bold">{u.plan || "Free"}</td>
                        <td className="p-4 font-extrabold text-[#03d665]">{u.credits}</td>
                        <td className="p-4 text-right"><button onClick={() => { setSelectedUser(u); setEditPlan(u.plan || "Free"); setEditCredits(u.credits || 0); setIsBanned(u.banned || false); setAddCreditAmount(""); }} className="px-3 py-1 bg-[#000] text-white text-xs font-bold rounded">Manage</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PLANS TAB */}
          {activeTab === "plans" && (
            <div className="bg-white rounded-2xl border border-[#f1f1f1] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#f1f1f1] flex justify-between items-center bg-[#fafbfe]">
                <h3 className="font-bold text-lg text-[#000]">Dynamic Plans</h3>
                <button onClick={openNewPlanModal} className="px-4 py-2 bg-[#03d665] text-white text-sm font-bold rounded-lg">+ Create Plan</button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {plansList.map((p, idx) => (
                  <div key={idx} className="border-2 border-[#f1f1f1] p-6 rounded-xl relative">
                    <h4 className="text-xl font-extrabold text-[#000]">{p.name}</h4>
                    <p className="text-[#03d665] font-bold text-2xl my-2">${p.price}</p>
                    <p className="text-sm font-medium">Credits: {p.credits}</p>
                    <div className="mt-4 flex gap-3">
                      <button onClick={() => openEditPlanModal(p)} className="px-4 py-1.5 bg-black text-white text-xs font-bold rounded">Edit</button>
                      <button onClick={() => handleDeletePlan(p.planId)} className="px-4 py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-2xl border border-[#f1f1f1] shadow-sm">
                <div className="text-sm font-bold text-[#585858] uppercase">Total Gen/Rewrites</div>
                <div className="text-5xl font-extrabold text-[#03d665] mt-2">{analytics.total_rewrites}</div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-[#f1f1f1] shadow-sm">
                <div className="text-sm font-bold text-[#585858] uppercase">Registered Users</div>
                <div className="text-5xl font-extrabold text-[#000] mt-2">{analytics.total_users}</div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-[#f1f1f1] shadow-sm">
                <div className="text-sm font-bold text-[#585858] uppercase">AI Engine Active</div>
                <div className="text-xl font-extrabold text-[#000] mt-2">{analytics.ai_engine}</div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-[#f1f1f1] shadow-sm">
                <div className="text-sm font-bold text-[#585858] uppercase">Database Status</div>
                <div className="text-xl font-extrabold text-[#03d665] mt-2">{analytics.active_database} 🟢</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PLAN MODAL */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-extrabold text-[#000] mb-4">Plan Details</h2>
            <div className="space-y-4">
              <div><label className="text-xs font-bold uppercase">Plan ID (e.g. pro-yearly)</label><input type="text" value={planForm.planId} onChange={e => setPlanForm({...planForm, planId: e.target.value})} className="w-full border p-2 rounded outline-none" /></div>
              <div><label className="text-xs font-bold uppercase">Plan Name</label><input type="text" value={planForm.name} onChange={e => setPlanForm({...planForm, name: e.target.value})} className="w-full border p-2 rounded outline-none" /></div>
              <div className="flex gap-4">
                <div className="flex-1"><label className="text-xs font-bold uppercase">Price ($)</label><input type="number" value={planForm.price} onChange={e => setPlanForm({...planForm, price: parseInt(e.target.value)})} className="w-full border p-2 rounded outline-none" /></div>
                <div className="flex-1"><label className="text-xs font-bold uppercase">Credits</label><input type="number" value={planForm.credits} onChange={e => setPlanForm({...planForm, credits: parseInt(e.target.value)})} className="w-full border p-2 rounded outline-none" /></div>
              </div>
              <div><label className="text-xs font-bold uppercase">Features (Comma separated)</label><textarea value={planForm.features} onChange={e => setPlanForm({...planForm, features: e.target.value})} placeholder="Feature 1, Feature 2" className="w-full border p-2 rounded outline-none h-20" /></div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowPlanModal(false)} className="px-4 py-2 bg-gray-200 rounded font-bold text-sm">Cancel</button>
              <button onClick={handleSavePlan} className="px-4 py-2 bg-[#03d665] text-white rounded font-bold text-sm">Save Plan</button>
            </div>
          </div>
        </div>
      )}

      {/* USER MODAL (আগের মতোই) */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-2xl shadow-2xl p-6">
            <h2 className="text-lg font-extrabold text-[#000] mb-4">Manage: {selectedUser.userId}</h2>
            <div className="flex gap-4 mb-4">
              <div className="flex-1"><label className="text-xs font-bold uppercase">Plan</label>
                <select value={editPlan} onChange={e => setEditPlan(e.target.value)} className="w-full border-2 p-2.5 rounded-xl font-bold">
                  {plansList.map(p => <option key={p.planId} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div className="flex-1"><label className="text-xs font-bold uppercase">Status</label>
                <button onClick={() => setIsBanned(!isBanned)} className={`w-full p-2.5 rounded-xl font-bold border-2 ${isBanned ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{isBanned ? '🚫 BANNED' : '✅ ACTIVE'}</button>
              </div>
            </div>
            <div className="bg-[#f8f9fc] p-4 rounded-xl border flex gap-4 items-center mb-6">
              <div className="flex-1"><span className="text-[10px] uppercase font-bold text-gray-400">Set Credits</span><input type="number" value={editCredits} onChange={e => setEditCredits(e.target.value)} className="w-full border-2 p-2 rounded-lg font-bold text-center" /></div>
              <div className="flex-1"><span className="text-[10px] uppercase font-bold text-gray-400">Add Bonus</span><input type="number" placeholder="+ Add Amount" value={addCreditAmount} onChange={e => setAddCreditAmount(e.target.value)} className="w-full border-2 p-2 rounded-lg font-bold text-center" /></div>
            </div>
            <div className="flex justify-between items-center">
              <button onClick={handleDeleteUser} className="text-red-500 font-bold text-sm underline">Delete User</button>
              <div className="flex gap-3"><button onClick={() => setSelectedUser(null)} className="px-5 py-2 bg-gray-200 rounded-xl font-bold">Cancel</button><button onClick={handleSaveUser} className="px-6 py-2 bg-[#03d665] text-white rounded-xl font-bold">Save</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}