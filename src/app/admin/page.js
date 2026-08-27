"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Advanced Modal States
  const [selectedUser, setSelectedUser] = useState(null);
  const [editPlan, setEditPlan] = useState("Free");
  const [editCredits, setEditCredits] = useState(0);
  const [isBanned, setIsBanned] = useState(false);
  const [addCreditAmount, setAddCreditAmount] = useState("");

  const fetchUsers = () => {
    fetch("https://enl-rewriter-backend.onrender.com/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsersList(data.users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (isLoaded && !user) router.push("/sign-in");
    else if (isLoaded && user) fetchUsers();
  }, [isLoaded, user, router]);

  const openAdminModal = (u) => {
    setSelectedUser(u);
    setEditPlan(u.plan || "Free");
    setEditCredits(u.credits || 0);
    setIsBanned(u.banned || false);
    setAddCreditAmount("");
  };

  const handleSaveUser = async () => {
    try {
      const finalCredits = addCreditAmount 
        ? parseInt(editCredits) + parseInt(addCreditAmount) 
        : parseInt(editCredits);

      const res = await fetch("https://enl-rewriter-backend.onrender.com/api/admin/super-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: selectedUser.userId, 
          plan: editPlan, 
          credits: finalCredits,
          banned: isBanned
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("User updated successfully!");
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (err) {
      alert("Update failed!");
    }
  };

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this user from the database?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://enl-rewriter-backend.onrender.com/api/admin/delete-user/${selectedUser.userId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        alert("User completely removed from database!");
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (err) {
      alert("Error deleting user.");
    }
  };

  if (!isLoaded || loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#03d665]"></div></div>;

  return (
    <div className="min-h-screen bg-[#fafbfe] text-[#585858] font-sans flex flex-col">
      <header className="h-[75px] bg-white border-b border-[#f1f1f1] flex items-center justify-between px-8 z-10 shadow-sm">
        <div className="text-[22px] font-extrabold text-[#000000]">
          ZeroWord<span className="text-[#03d665]">Ai</span> <span className="text-xs bg-black text-white px-2 py-0.5 rounded uppercase ml-2">Super Admin</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push("/dashboard")} className="text-sm font-bold bg-[#f1f1f1] px-4 py-2 rounded-lg hover:bg-[#e1e1e1] text-[#000000]">Exit to App</button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-2xl border border-[#f1f1f1] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#f1f1f1] flex justify-between items-center bg-[#fafbfe]">
            <h3 className="font-bold text-lg text-[#000000]">Total Users: {usersList.length}</h3>
          </div>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs uppercase tracking-wider border-b border-[#f1f1f1]">
                <th className="p-4 pl-6">User ID</th>
                <th className="p-4">Status</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Credits</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#f1f1f1]">
              {usersList.map((u, idx) => (
                <tr key={idx} className="hover:bg-[#fafbfe] transition">
                  <td className="p-4 pl-6 font-mono text-xs font-bold text-[#000000]">{u.userId}</td>
                  <td className="p-4">
                    {u.banned ? <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-bold">BANNED</span> : <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">ACTIVE</span>}
                  </td>
                  <td className="p-4 font-bold">{u.plan || "Free"}</td>
                  <td className="p-4 font-extrabold text-[#03d665]">{u.credits}</td>
                  <td className="p-4 pr-6 text-right">
                    <button onClick={() => openAdminModal(u)} className="px-4 py-2 bg-[#000000] text-white text-xs font-bold rounded-lg shadow hover:bg-gray-800 transition">
                      Manage User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🚀 ULTIMATE USER MANAGEMENT MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white w-[500px] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            <div className="bg-[#fafbfe] px-6 py-4 border-b border-[#f1f1f1] flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-[#000000]">Manage: <span className="text-sm font-mono font-medium text-[#585858] ml-2">{selectedUser.userId}</span></h2>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-black font-bold text-xl">&times;</button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Plan & Ban Control */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#585858] mb-2">Subscription Plan</label>
                  <select value={editPlan} onChange={(e) => setEditPlan(e.target.value)} className="w-full border-2 border-[#f1f1f1] p-2.5 rounded-xl focus:border-[#03d665] outline-none font-bold text-[#000]">
                    <option value="Free">Free Plan</option>
                    <option value="Pro">Pro Plan</option>
                    <option value="Enterprise">Enterprise Plan</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#585858] mb-2">Account Status</label>
                  <button 
                    onClick={() => setIsBanned(!isBanned)} 
                    className={`w-full p-2.5 rounded-xl font-bold border-2 transition ${isBanned ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}
                  >
                    {isBanned ? '🚫 BANNED (Click to Unban)' : '✅ ACTIVE (Click to Ban)'}
                  </button>
                </div>
              </div>

              {/* Credit Control Engine */}
              <div className="bg-[#f8f9fc] p-4 rounded-xl border border-[#eef0f5]">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#585858] mb-3">Credit Management Engine</label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Set Exact Credits (=)</span>
                    <input type="number" value={editCredits} onChange={(e) => setEditCredits(e.target.value)} className="w-full border-2 border-gray-200 p-2 rounded-lg font-bold text-center outline-none focus:border-[#03d665]" />
                  </div>
                  <div className="text-xl font-extrabold text-gray-300 mt-4">+</div>
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Add Bonus Credits (+)</span>
                    <input type="number" placeholder="+ Add Amount" value={addCreditAmount} onChange={(e) => setAddCreditAmount(e.target.value)} className="w-full border-2 border-gray-200 p-2 rounded-lg font-bold text-center outline-none focus:border-[#03d665] placeholder-gray-300" />
                  </div>
                </div>
              </div>
              
              {/* Danger Zone */}
              <div className="border-t border-[#f1f1f1] pt-6 flex justify-between items-center">
                <button onClick={handleDeleteUser} className="text-red-500 hover:text-red-700 font-bold text-sm underline">
                  Permanently Delete User
                </button>
                <div className="flex gap-3">
                  <button onClick={() => setSelectedUser(null)} className="px-5 py-2.5 bg-[#f1f1f1] text-[#000] rounded-xl font-bold hover:bg-[#e1e1e1]">Cancel</button>
                  <button onClick={handleSaveUser} className="px-6 py-2.5 bg-[#03d665] text-white rounded-xl font-bold shadow-lg shadow-[#03d665]/30 hover:bg-[#02a64e]">Save Changes</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}