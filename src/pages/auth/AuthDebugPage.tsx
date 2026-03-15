// src/pages/auth/AuthDebugPage.tsx  
// TEMPORARY debug page — remove before final launch
// Access at /auth/debug to diagnose Supabase config issues

import { useState } from 'react';
import { supabase, getAppBaseUrl } from '@/lib/supabase/client';

export function AuthDebugPage() {
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [`[${new Date().toISOString().slice(11,19)}] ${msg}`, ...prev]);

  const testConnection = async () => {
    addLog('Testing Supabase connection…');
    try {
      const url  = import.meta.env.VITE_SUPABASE_URL;
      const key  = import.meta.env.VITE_SUPABASE_ANON_KEY;
      addLog(`VITE_SUPABASE_URL: ${url ? url.substring(0,40) + '…' : '❌ NOT SET'}`);
      addLog(`VITE_SUPABASE_ANON_KEY: ${key ? key.substring(0,20) + '…' : '❌ NOT SET'}`);
      addLog(`VITE_APP_URL: ${import.meta.env.VITE_APP_URL || '❌ NOT SET (using origin)'}`);
      addLog(`getAppBaseUrl(): ${getAppBaseUrl()}`);

      const { data, error } = await supabase.auth.getSession();
      addLog(`getSession: ${error ? '❌ ' + error.message : '✅ ' + (data.session ? 'session exists' : 'no session')}`);
    } catch (e: any) {
      addLog(`❌ Exception: ${e.message}`);
    }
  };

  const testReset = async () => {
    addLog('Testing resetPasswordForEmail…');
    const email = (document.getElementById('debug-email') as HTMLInputElement)?.value;
    if (!email) { addLog('❌ Enter email first'); return; }
    try {
      const redirectTo = `${getAppBaseUrl()}/auth/callback`;
      addLog(`redirectTo: ${redirectTo}`);
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      addLog(error ? `❌ Error: ${error.message}` : `✅ Reset email sent to ${email}`);
    } catch (e: any) {
      addLog(`❌ Exception: ${e.message}`);
    }
  };

  const testMagicLink = async () => {
    addLog('Testing signInWithOtp (magic link)…');
    const email = (document.getElementById('debug-email') as HTMLInputElement)?.value;
    if (!email) { addLog('❌ Enter email first'); return; }
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${getAppBaseUrl()}/auth/callback`, shouldCreateUser: false },
      });
      addLog(error ? `❌ Error: ${error.message}` : `✅ Magic link sent to ${email}`);
    } catch (e: any) {
      addLog(`❌ Exception: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ background: '#0A0A0C', color: '#F0EDE8', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#C9A96E', marginBottom: 24 }}>Hypnotic Auth Debug</h1>

      <div style={{ marginBottom: 16 }}>
        <input id="debug-email" type="email" defaultValue="niddhishp@gmail.com"
          style={{ padding: '8px 12px', background: '#0D0D10', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#F0EDE8', width: 280, marginRight: 8, fontSize: 13 }}
          placeholder="email" />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Test Connection', fn: testConnection },
          { label: 'Test Reset Email', fn: testReset },
          { label: 'Test Magic Link', fn: testMagicLink },
        ].map(b => (
          <button key={b.label} onClick={b.fn}
            style={{ padding: '8px 16px', background: '#C9A96E', color: '#08080A', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            {b.label}
          </button>
        ))}
        <button onClick={() => setLog([])}
          style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.08)', color: '#777', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13 }}>
          Clear
        </button>
      </div>

      <div style={{ background: '#0D0D10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, minHeight: 200, maxHeight: 400, overflowY: 'auto' }}>
        {log.length === 0
          ? <p style={{ color: '#444', fontSize: 13 }}>Press a button to run tests…</p>
          : log.map((l, i) => (
            <div key={i} style={{ fontSize: 12, color: l.includes('❌') ? '#e07a7a' : l.includes('✅') ? '#7abf8e' : '#888', marginBottom: 4 }}>{l}</div>
          ))
        }
      </div>

      <p style={{ color: '#333', fontSize: 12, marginTop: 16 }}>
        Remove this page (/auth/debug) before final launch.
      </p>
    </div>
  );
}
