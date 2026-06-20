// src/app/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';

export default function MallLobby() {
  const { profile, loginWithGoogle, logout, loading } = useAuth();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-black tracking-tight text-emerald-600 mb-2 sm:text-5xl">
        KABALE ONLINE V2
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-md">
        Welcome to the Digital Mall. Find trusted shops across Kabale instantly.
      </p>

      {loading ? (
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      ) : profile ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-sm w-full">
          <p className="font-semibold text-slate-800">Welcome back,</p>
          <p className="text-emerald-600 font-bold mb-4">{profile.displayName || profile.email}</p>
          <div className="text-xs text-left bg-slate-50 p-3 rounded-lg font-mono text-slate-500 mb-6">
            <div>Role: {profile.role}</div>
            <div>UID: {profile.uid.slice(0, 8)}...</div>
          </div>
          <button 
            onClick={logout}
            className="w-full bg-slate-900 text-white font-medium py-2.5 px-4 rounded-xl hover:bg-slate-800 transition"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={loginWithGoogle}
          className="flex items-center gap-3 bg-white text-slate-700 font-semibold py-3 px-6 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.58z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"/>
            <path fill="#FBBC05" d="M5.32 14.24A7.16 7.16 0 0 1 4.91 12c0-.79.13-1.57.41-2.24V6.61H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.39l4.11-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.39l4.11 3.15c.94-2.85 3.57-4.96 6.68-4.96z"/>
          </svg>
          Continue with Google
        </button>
      )}
    </main>
  );
}
