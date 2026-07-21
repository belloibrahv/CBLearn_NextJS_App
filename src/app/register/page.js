'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, matricNumber, department, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }
      router.push('/dashboard');
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
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 25, lineHeight: 1.5, maxWidth: 420 }}>
          &ldquo;Set up your profile once, and every lesson, quiz score, and progress report is saved to your account.&rdquo;
        </p>
        <div style={{ fontSize: 12.5, opacity: 0.7 }}>Computer-Based Learning System · Tai Solarin University of Education</div>
      </div>
      <div className="md-auth-form-side">
        <div className="md-auth-box">
          <h2 className="md-headline" style={{ fontSize: 26, marginBottom: 6 }}>Create your account</h2>
          <p className="md-body-sm" style={{ marginBottom: 26 }}>Register with your student details to begin.</p>
          <form onSubmit={handleSubmit}>
            <div className="md-field">
              <label>Full Name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="md-field">
              <label>Matriculation Number</label>
              <input value={matricNumber} onChange={(e) => setMatricNumber(e.target.value)} placeholder="CSC/2022/0148" required />
            </div>
            <div className="md-field">
              <label>Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option>Computer Science</option>
              </select>
            </div>
            <div className="md-field">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
            </div>
            {error && <div className="md-chip md-chip-error" style={{ marginBottom: 16 }}>{error}</div>}
            <button type="submit" disabled={loading} className="md-btn md-btn-filled" style={{ width: '100%', padding: 13 }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
          <p className="md-body-sm" style={{ textAlign: 'center', marginTop: 18 }}>
            Already registered? <Link href="/login" style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
