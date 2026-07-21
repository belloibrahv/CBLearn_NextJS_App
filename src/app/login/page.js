'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [matricNumber, setMatricNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricNumber, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed.');
        setLoading(false);
        return;
      }
      router.push(data.user.role === 'admin' ? '/admin' : '/dashboard');
      router.refresh();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="md-auth-wrap">
      <div className="md-auth-visual">
        <div className="md-brand" style={{ fontSize: 24 }}>
          <div className="mark"><span className="material-symbols-outlined">school</span></div>
          CBLearn
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 25, lineHeight: 1.5, maxWidth: 420 }}>
            &ldquo;Learn at your own pace, get feedback the moment you need it, and track every step of your progress.&rdquo;
          </p>
          <div style={{ marginTop: 30, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {['Course Modules', 'Instant Quiz Feedback', 'Progress Tracking'].map((t) => (
              <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', padding: '8px 14px', borderRadius: 30, fontSize: 12.5 }}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 12.5, opacity: 0.7 }}>Computer-Based Learning System · Tai Solarin University of Education</div>
      </div>
      <div className="md-auth-form-side">
        <div className="md-auth-box">
          <h2 className="md-headline" style={{ fontSize: 26, marginBottom: 6 }}>Welcome back</h2>
          <p className="md-body-sm" style={{ marginBottom: 26 }}>Sign in to continue your learning modules and quizzes.</p>
          <form onSubmit={handleSubmit}>
            <div className="md-field">
              <label>Matriculation Number</label>
              <input value={matricNumber} onChange={(e) => setMatricNumber(e.target.value)} placeholder="CSC/2022/0148" required />
            </div>
            <div className="md-field">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <div className="md-chip md-chip-error" style={{ marginBottom: 16 }}>{error}</div>}
            <button type="submit" disabled={loading} className="md-btn md-btn-filled" style={{ width: '100%', padding: 13 }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="md-body-sm" style={{ textAlign: 'center', marginTop: 18 }}>
            Don&apos;t have an account? <Link href="/register" style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>Create one</Link>
          </p>
          <p className="md-body-sm" style={{ textAlign: 'center', marginTop: 8, opacity: 0.7 }}>
            Admin demo login: ADMIN/0001 · admin123
          </p>
        </div>
      </div>
    </div>
  );
}
