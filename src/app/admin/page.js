import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { query } from '@/db';
import TopNav from '@/components/TopNav';

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'admin') redirect('/dashboard');

  const students = await query("SELECT id, full_name, matric_number, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC", []);
  const totalModules = (await query('SELECT COUNT(*) AS c FROM modules', []))[0].c;

  const rows = [];
  for (const s of students) {
    const results = await query('SELECT score FROM results WHERE user_id = ?', [s.id]);
    const completedModules = (await query("SELECT COUNT(*) AS c FROM progress WHERE user_id = ? AND status = 'completed'", [s.id]))[0].c;
    const avgScore = results.length > 0 ? Math.round((results.reduce((a, r) => a + r.score, 0) / results.length) * 10) / 10 : null;
    rows.push({ ...s, completedModules, avgScore, quizzesTaken: results.length });
  }
  const allAvg = rows.filter((r) => r.avgScore != null).map((r) => r.avgScore);
  const platformAvg = allAvg.length > 0 ? Math.round((allAvg.reduce((a, b) => a + b, 0) / allAvg.length) * 10) / 10 : 0;

  return (
    <>
      <TopNav user={user} />
      <div className="md-shell">
        <div className="md-label">Admin Panel</div>
        <h1 className="md-display" style={{ fontSize: 28, margin: '4px 0 6px' }}>Student Performance Overview</h1>
        <p className="md-body-sm" style={{ maxWidth: 640, marginBottom: 26 }}>
          Monitor registered students, module completion, and quiz performance across the platform.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 30 }}>
          <div className="md-card-elevated">
            <div className="md-body-sm">REGISTERED STUDENTS</div>
            <div className="md-display" style={{ fontSize: 28, margin: '4px 0' }}>{students.length}</div>
          </div>
          <div className="md-card-elevated">
            <div className="md-body-sm">COURSE MODULES</div>
            <div className="md-display" style={{ fontSize: 28, margin: '4px 0' }}>{totalModules}</div>
          </div>
          <div className="md-card-elevated">
            <div className="md-body-sm">PLATFORM AVERAGE SCORE</div>
            <div className="md-display" style={{ fontSize: 28, margin: '4px 0' }}>{platformAvg}%</div>
          </div>
        </div>

        <div className="md-headline" style={{ fontSize: 18, marginBottom: 14 }}>Student Records</div>
        <div className="md-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: 'var(--md-sys-color-surface-container-high)' }}>
                {['Name', 'Matric No.', 'Modules Completed', 'Quizzes Taken', 'Avg. Score'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--md-sys-color-on-surface-variant)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
                  <td style={{ padding: '12px 16px' }}>{r.full_name}</td>
                  <td style={{ padding: '12px 16px' }}>{r.matric_number}</td>
                  <td style={{ padding: '12px 16px' }}>{r.completedModules} / {totalModules}</td>
                  <td style={{ padding: '12px 16px' }}>{r.quizzesTaken}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>{r.avgScore != null ? `${r.avgScore}%` : '—'}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center' }} className="md-body-sm">No students registered yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
