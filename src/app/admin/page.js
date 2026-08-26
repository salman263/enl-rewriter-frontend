"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    } else if (isLoaded && user) {
      fetch("https://enl-rewriter-backend.onrender.com/api/admin/users")
        .then((res) => res.json())
        .then((data) => {
          if (data.users) {
            setUsersList(data.users);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          setLoading(false);
        });
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafbfe]">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#03d665]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfe] text-[#585858] font-sans flex flex-col">
      
      {/* Modern Admin Header */}
      <header className="h-[75px] bg-white border-b border-[#f1f1f1] flex items-center justify-between px-8 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-[22px] font-extrabold text-[#000000]">
            ZeroWord<span className="text-[#03d665]">Ai</span> <span className="text-xs bg-[#e1fff7] text-[#03d665] px-2 py-0.5 rounded-full uppercase ml-2">Admin Panel</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.push("/dashboard")}
            className="text-sm font-medium bg-[#f1f1f1] px-4 py-2 rounded-lg hover:bg-[#e1e1e1] transition text-[#000000]"
          >
            Exit to App
          </button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] border border-[#f1f1f1]">
            <div className="text-sm text-[#585858] font-medium mb-1">Total Users</div>
            <div className="text-3xl font-extrabold text-[#000000]">{usersList.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] border border-[#f1f1f1]">
            <div className="text-sm text-[#585858] font-medium mb-1">Active System Status</div>
            <div className="text-lg font-bold text-[#03d665] flex items-center gap-2 mt-1">
              <span className="h-3 w-3 rounded-full bg-[#03d665] animate-pulse"></span> Online & Secure
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] border border-[#f1f1f1]">
            <div className="text-sm text-[#585858] font-medium mb-1">Database Engine</div>
            <div className="text-lg font-bold text-[#000000] mt-1">MongoDB Atlas</div>
          </div>
        </div>

        {/* Users Table Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] border border-[#f1f1f1] overflow-hidden">
          <div className="p-6 border-b border-[#f1f1f1] flex justify-between items-center">
            <h3 className="font-bold text-lg text-[#000000]">All Registered Users</h3>
            <span className="text-xs bg-[#fafbfe] border border-[#f1f1f1] px-3 py-1.5 rounded-lg font-medium text-[#585858]">
              Live Data from MongoDB
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fafbfe] text-[#585858] text-xs uppercase tracking-wider border-b border-[#f1f1f1]">
                  <th className="p-4 pl-6">User ID</th>
                  <th className="p-4">Subscription Plan</th>
                  <th className="p-4 pr-6">Remaining Credits</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-[#f1f1f1]">
                {usersList.length > 0 ? (
                  usersList.map((u, idx) => (
                    <tr key={idx} className="hover:bg-[#fafbfe] transition">
                      <td className="p-4 pl-6 font-mono text-xs text-[#000000] font-medium">{u.userId}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                          u.plan === 'Pro' 
                            ? 'bg-[#e1fff7] text-[#03d665]' 
                            : u.plan === 'Enterprise' 
                            ? 'bg-black text-white' 
                            : 'bg-[#f1f1f1] text-[#585858]'
                        }`}>
                          {u.plan || "Free"}
                        </span>
                      </td>
                      <td className="p-4 pr-6 font-extrabold text-[#03d665]">{u.credits}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-[#c2c2c2]">No users found in database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}