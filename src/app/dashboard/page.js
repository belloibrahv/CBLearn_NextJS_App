import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { query } from '@/db';
import TopNav from '@/components/TopNav';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role === 'admin') redirect('/admin');

  const modules = await query('SELECT * FROM modules ORDER BY sequence_no ASC', []);
  const progressRows = await query('SELECT * FROM progress WHERE user_id = ?', [user.id]);
  const progressMap = {};
  progressRows.forEach((p) => { progressMap[p.module_id] = p; });

  const results = await query(
    `SELECT r.*, l.module_id FROM results r JOIN quizzes q ON r.quiz_id = q.id JOIN lessons l ON q.lesson_id = l.id WHERE r.user_id = ?`,
    [user.id]
  );

  const bestScoreByModule = {};
  results.forEach((r) => {
    if (!bestScoreByModule[r.module_id] || r.score > bestScoreByModule[r.module_id]) {
      bestScoreByModule[r.module_id] = r.score;
    }
  });

  const enriched = modules.map((m) => ({
    ...m,
    status: progressMap[m.id]?.status || 'not_started',
    bestScore: bestScoreByModule[m.id] != null ? Math.round(bestScoreByModule[m.id]) : null,
  }));

  const completedCount = enriched.filter((m) => m.status === 'completed').length;
  const overallProgress = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;
  const avgScore = results.length > 0 ? Math.round((results.reduce((a, r) => a + r.score, 0) / results.length) * 10) / 10 : null;

  const inProgressModule = enriched.find((m) => m.status === 'in_progress') || enriched.find((m) => m.status === 'not_started');

  return (
    <>
      <TopNav user={user} />
      <div className="md-shell">
        <div style={{ marginBottom: 24 }}>
          <div className="md-label">Dashboard</div>
          <h1 className="md-display" style={{ fontSize: 28, margin: '4px 0 6px' }}>Welcome back, {user.fullName.split(' ')[0]}</h1>
          <p className="md-body-sm" style={{ maxWidth: 640 }}>
            {inProgressModule
              ? `Continue with "${inProgressModule.title}" or review a completed module below.`
              : 'You have completed all available modules. Great work!'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 30 }}>
          <div className="md-card-elevated">
            <div className="md-body-sm">OVERALL PROGRESS</div>
            <div className="md-display" style={{ fontSize: 28, margin: '4px 0' }}>{overallProgress}%</div>
            <div className="md-linear-track" style={{ marginTop: 8 }}>
              <div className="md-linear-fill" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
          <div className="md-card-elevated">
            <div className="md-body-sm">AVERAGE QUIZ SCORE</div>
            <div className="md-display" style={{ fontSize: 28, margin: '4px 0' }}>{avgScore != null ? avgScore : '—'}</div>
            <div className="md-body-sm">Across {results.length} quiz{results.length === 1 ? '' : 'zes'} taken</div>
          </div>
          <div className="md-card-elevated">
            <div className="md-body-sm">MODULES COMPLETED</div>
            <div className="md-display" style={{ fontSize: 28, margin: '4px 0' }}>{completedCount} / {modules.length}</div>
            <div className="md-body-sm">Self-paced modules</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '30px 0 14px' }}>
          <span className="md-headline" style={{ fontSize: 18 }}>Course Modules</span>
          <span className="md-chip md-chip-neutral">{modules.length} total</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {enriched.map((m) => (
            <Link key={m.id} href={`/modules/${m.id}`} className="md-card" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: m.status === 'completed' ? 'var(--md-sys-color-success)' : 'var(--md-sys-color-primary)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13,
              }}>
                {m.status === 'completed' ? <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span> : m.sequence_no}
              </div>
              <div style={{ flex: 1 }}>
                <div className="md-title">{m.title}</div>
                <div className="md-body-sm">{m.description}</div>
              </div>
              <div>
                {m.status === 'completed' && <span className="md-chip md-chip-success">Completed{m.bestScore != null ? ` · ${m.bestScore}%` : ''}</span>}
                {m.status === 'in_progress' && <span className="md-chip md-chip-progress">In Progress{m.bestScore != null ? ` · ${m.bestScore}%` : ''}</span>}
                {m.status === 'not_started' && <span className="md-chip md-chip-neutral">Not started</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
