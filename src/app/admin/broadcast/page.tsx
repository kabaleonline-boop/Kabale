// src/app/admin/broadcast/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getAllUsers } from '@/services/adminService';
import { UserProfile } from '@/types';

export default function AdminBroadcastPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // Broadcast Execution State
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    async function loadUsers() {
      const data = await getAllUsers();
      setUsers(data);
      setLoading(false);
    }
    loadUsers();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm(`Are you sure you want to send this to all ${users.length} users?`)) return;

    setIsBroadcasting(true);
    setProgress(0);
    setLogs(['Initiating individual dispatch queue...']);

    // Queue system: Dispatching individually with rate limiting
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      try {
        // In a production environment, this calls your Next.js API route 
        // e.g., await fetch('/api/send-email', { method: 'POST', body: JSON.stringify({ to: user.email, subject, message }) })
        
        // Simulating the network request and individual processing
        await new Promise(resolve => setTimeout(resolve, 800)); // 800ms rate limit delay per email
        
        setLogs(prev => [`[Success] Sent to ${user.email}`, ...prev]);
      } catch (error) {
        setLogs(prev => [`[Failed] Could not send to ${user.email}`, ...prev]);
      }

      setProgress(Math.round(((i + 1) / users.length) * 100));
    }

    setLogs(prev => ['Broadcast complete.', ...prev]);
    setIsBroadcasting(false);
    setSubject('');
    setMessage('');
  };

  if (loading) return <div className="animate-pulse bg-slate-200 h-64 rounded-3xl w-full max-w-4xl mx-auto"></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Platform Broadcast</h1>
        <p className="text-slate-500 text-sm">Send updates to all registered users. Dispatched individually to protect sender reputation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Composer Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Total Recipients</label>
              <input type="text" disabled value={`${users.length} Verified Users`} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-bold" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Subject Line</label>
              <input 
                type="text" 
                required 
                disabled={isBroadcasting}
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white transition" 
                placeholder="Platform Update: New Features!" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Message Body</label>
              <textarea 
                required 
                disabled={isBroadcasting}
                rows={8}
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-600 focus:bg-white transition resize-none" 
                placeholder="Write your email content here..." 
              />
            </div>
            <button 
              type="submit" 
              disabled={isBroadcasting || users.length === 0}
              className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isBroadcasting ? (
                <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Sending...</>
              ) : (
                <>🚀 Dispatch Broadcast</>
              )}
            </button>
          </form>
        </div>

        {/* Execution Logs & Progress */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col">
          <h3 className="text-white font-bold mb-4 flex items-center justify-between">
            <span>Dispatch Console</span>
            <span className="text-emerald-400 text-sm font-mono">{progress}%</span>
          </h3>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 mb-6 overflow-hidden">
            <div className="bg-emerald-500 h-2.5 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>

          {/* Live Terminal */}
          <div className="flex-1 bg-black/50 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-y-auto max-h-96 space-y-2 border border-slate-800">
            {logs.length === 0 ? (
              <span className="text-slate-600">Waiting for broadcast initialization...</span>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className={`${log.includes('[Success]') ? 'text-emerald-400' : log.includes('[Failed]') ? 'text-red-400' : 'text-slate-300'}`}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
