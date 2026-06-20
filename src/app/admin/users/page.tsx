// src/app/admin/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole } from '@/services/adminService';
import { UserProfile } from '@/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      const data = await getAllUsers();
      setUsers(data);
      setLoading(false);
    }
    loadUsers();
  }, []);

  const handleRoleChange = async (uid: string, newRole: 'buyer' | 'seller' | 'admin') => {
    if (!window.confirm(`Change this user's role to ${newRole.toUpperCase()}?`)) return;
    try {
      await updateUserRole(uid, newRole);
      setUsers(users.map(user => user.uid === uid ? { ...user, role: newRole } : user));
    } catch (error) {
      alert('Failed to update role.');
    }
  };

  if (loading) return <div className="animate-pulse bg-slate-200 h-64 rounded-3xl w-full"></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">User Management</h1>
        <p className="text-slate-500 text-sm">Control platform access levels and administrative privileges.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4 text-right">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.uid} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">{user.displayName || 'Unknown'}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'seller' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg focus:outline-none focus:border-emerald-500 px-3 py-1.5"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.uid, e.target.value as any)}
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
