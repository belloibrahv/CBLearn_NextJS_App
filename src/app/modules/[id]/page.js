import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { query } from '@/db';
import TopNav from '@/components/TopNav';

export default async function ModulePage({ params }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const { id } = await params;
  const modules = await query('SELECT * FROM modules WHERE id = ?', [id]);
  const mod = modules[0];
  if (!mod) notFound();

  const lessons = await query('SELECT * FROM lessons WHERE module_id = ? ORDER BY sequence_no ASC', [id]);
  const results = await query(
    `SELECT r.score, q.lesson_id FROM results r JOIN quizzes q ON r.quiz_id = q.id WHERE r.user_id = ?`,
    [user.id]
  );
  const bestByLesson = {};
  results.forEach((r) => {
    if (!bestByLesson[r.lesson_id] || r.score > bestByLesson[r.lesson_id]) bestByLesson[r.lesson_id] = r.score;
  });

  return (
    <>
      <TopNav user={user} />
      <div className="md-shell">
        <Link href="/dashboard" className="md-body-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16, color: 'var(--md-sys-color-primary)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span> Back to Dashboard
        </Link>
        <div className="md-label">Module {mod.sequence_no}</div>
        <h1 className="md-display" style={{ fontSize: 28, margin: '4px 0 6px' }}>{mod.title}</h1>
        <p className="md-body-sm" style={{ maxWidth: 640, marginBottom: 26 }}>{mod.description}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {lessons.map((l, idx) => {
            const score = bestByLesson[l.id];
            return (
              <Link key={l.id} href={`/lessons/${l.id}`} className="md-card" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: score != null ? 'var(--md-sys-color-success)' : 'var(--md-sys-color-primary)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13,
                }}>
                  {score != null ? <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span> : idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="md-title">{l.title}</div>
                  <div className="md-body-sm">{l.media_note}</div>
                </div>
                {score != null && <span className="md-chip md-chip-success">{Math.round(score)}%</span>}
                <span className="material-symbols-outlined" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>chevron_right</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
