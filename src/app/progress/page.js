import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { query } from '@/db';
import TopNav from '@/components/TopNav';

export default async function ProgressPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role === 'admin') redirect('/admin');

  const history = await query(
    `SELECT r.id, r.score, r.correct_count, r.total_count, r.date_taken,
            qz.title AS quiz_title, l.title AS lesson_title, m.title AS module_title
     FROM results r
     JOIN quizzes qz ON r.quiz_id = qz.id
     JOIN lessons l ON qz.lesson_id = l.id
     JOIN modules m ON l.module_id = m.id
     WHERE r.user_id = ?
     ORDER BY r.date_taken DESC`,
    [user.id]
  );

  const byModule = {};
  history.forEach((h) => {
    if (!byModule[h.module_title] || h.score > byModule[h.module_title]) byModule[h.module_title] = h.score;
  });
  const chartData = Object.entries(byModule);
  const avgScore = history.length > 0 ? Math.round((history.reduce((a, h) => a + h.score, 0) / history.length) * 10) / 10 : null;

  return (
    <>
      <TopNav user={user} />
      <div className="md-shell">
        <div className="md-label">My Progress</div>
        <h1 className="md-display" style={{ fontSize: 28, margin: '4px 0 6px' }}>Performance Overview</h1>
        <p className="md-body-sm" style={{ maxWidth: 640, marginBottom: 26 }}>
          Quiz scores are recorded automatically after every attempt, so you can track improvement across modules over time.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 30 }}>
          <div className="md-card">
            <div className="md-headline" style={{ fontSize: 16, marginBottom: 14 }}>Best Score by Module</div>
            {chartData.length === 0 ? (
              <p className="md-body-sm">No quizzes attempted yet.</p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 160, paddingTop: 10 }}>
                {chartData.map(([title, score]) => (
                  <div key={title} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div className="md-body-sm" style={{ fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>{Math.round(score)}%</div>
                    <div style={{ width: '100%', height: `${Math.round(score)}%`, minHeight: 4, borderRadius: '6px 6px 0 0', background: 'linear-gradient(180deg, var(--md-sys-color-secondary), #8A5A16)' }} />
                    <div className="md-body-sm" style={{ textAlign: 'center', fontSize: 11 }}>{title.replace(/^\d+\.\s*/, '')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="md-card">
            <div className="md-headline" style={{ fontSize: 16, marginBottom: 14 }}>Summary</div>
            <table style={{ width: '100%', fontSize: 13.5, borderCollapse: 'collapse' }}>
              <tbody>
                <tr><td style={{ padding: '8px 0' }}>Quizzes attempted</td><td style={{ textAlign: 'right', fontWeight: 700 }}>{history.length}</td></tr>
                <tr><td style={{ padding: '8px 0' }}>Average score</td><td style={{ textAlign: 'right', fontWeight: 700 }}>{avgScore != null ? `${avgScore}%` : '—'}</td></tr>
                <tr><td style={{ padding: '8px 0' }}>Modules with a recorded score</td><td style={{ textAlign: 'right', fontWeight: 700 }}>{chartData.length}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="md-headline" style={{ fontSize: 18, marginBottom: 14 }}>Quiz History</div>
        <div className="md-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: 'var(--md-sys-color-surface-container-high)' }}>
                {['Module', 'Quiz', 'Date', 'Score'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: 0.4, color: 'var(--md-sys-color-on-surface-variant)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} style={{ borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
                  <td style={{ padding: '12px 16px' }}>{h.module_title}</td>
                  <td style={{ padding: '12px 16px' }}>{h.quiz_title}</td>
                  <td style={{ padding: '12px 16px' }}>{new Date(h.date_taken).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>{Math.round(h.score)}%</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 20, textAlign: 'center' }} className="md-body-sm">No quiz attempts yet. Head to your dashboard to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
