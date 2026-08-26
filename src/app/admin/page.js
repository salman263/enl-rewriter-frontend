"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
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
      // ব্যাকএন্ড থেকে সব ইউজারের ডেটা ফেচ করা
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
    <div className="min-h-screen bg-[#fafbfe] p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#000000]">
            👑 Admin <span className="text-[#03d665]">Dashboard</span>
          </h1>
          <button 
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-white border border-[#f1f1f1] text-sm font-bold rounded-lg shadow-sm hover:text-[#03d665]"
          >
            Back to App
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#f1f1f1] overflow-hidden">
          <div className="p-6 border-b border-[#f1f1f1] font-bold text-lg text-[#000000]">
            Registered Users ({usersList.length})
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fafbfe] text-[#585858] text-xs uppercase border-b border-[#f1f1f1]">
                  <th className="p-4">User ID</th>
                  <th className="p-4">Current Plan</th>
                  <th className="p-4">Credits Left</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-[#f1f1f1]">
                {usersList.map((u, idx) => (
                  <tr key={idx} className="hover:bg-[#fafbfe]">
                    <td className="p-4 font-medium text-[#000000]">{u.userId}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${u.plan === 'Pro' ? 'bg-[#e1fff7] text-[#03d665]' : u.plan === 'Enterprise' ? 'bg-black text-white' : 'bg-[#f1f1f1] text-[#585858]'}`}>
                        {u.plan || "Free"}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#03d665]">{u.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}