import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';
import { query } from '@/db';
import TopNav from '@/components/TopNav';
import QuizPanel from '@/components/QuizPanel';

export default async function LessonPage({ params }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const { id } = await params;
  const lessonRows = await query('SELECT * FROM lessons WHERE id = ?', [id]);
  const lesson = lessonRows[0];
  if (!lesson) notFound();

  const moduleRows = await query('SELECT * FROM modules WHERE id = ?', [lesson.module_id]);
  const mod = moduleRows[0];
  const siblingLessons = await query('SELECT id, title, sequence_no FROM lessons WHERE module_id = ? ORDER BY sequence_no ASC', [lesson.module_id]);

  const quizRows = await query('SELECT * FROM quizzes WHERE lesson_id = ?', [id]);
  const quizRow = quizRows[0];
  let quiz = null;
  if (quizRow) {
    const qRows = await query('SELECT id, question_text, options, sequence_no FROM questions WHERE quiz_id = ? ORDER BY sequence_no ASC', [quizRow.id]);
    quiz = {
      id: quizRow.id,
      title: quizRow.title,
      questions: qRows.map((q) => ({
        id: q.id,
        questionText: q.question_text,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      })),
    };
  }

  return (
    <>
      <TopNav user={user} />
      <div className="md-shell">
        <Link href={`/modules/${mod.id}`} className="md-body-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16, color: 'var(--md-sys-color-primary)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span> Back to {mod.title}
        </Link>
        <div className="md-label">{mod.title}</div>
        <h1 className="md-display" style={{ fontSize: 26, margin: '4px 0 20px' }}>{lesson.title}</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
          <div>
            <div style={{
              background: '#0E2247', borderRadius: 16, aspectRatio: '16/8', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: 18, position: 'relative',
            }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.16)', border: '2px solid rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 28 }}>play_arrow</span>
              </div>
              <div style={{ position: 'absolute', bottom: 14, left: 16, fontSize: 12, opacity: 0.85 }}>{lesson.media_note}</div>
            </div>

            <p className="md-body" style={{ whiteSpace: 'pre-line' }}>{lesson.content_body}</p>

            {quiz && (
              <div style={{ marginTop: 28 }}>
                <div className="md-headline" style={{ fontSize: 18, marginBottom: 4 }}>{quiz.title}</div>
                <p className="md-body-sm" style={{ marginBottom: 16 }}>Answer each question, then submit to see your score and immediate feedback.</p>
                <QuizPanel quiz={quiz} />
              </div>
            )}
          </div>

          <div>
            <div className="md-card" style={{ marginBottom: 16 }}>
              <div className="md-title" style={{ marginBottom: 10 }}>Module Contents</div>
              <div style={{ fontSize: 13, lineHeight: 2 }}>
                {siblingLessons.map((sl) => (
                  <div key={sl.id} style={{ color: sl.id === lesson.id ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)', fontWeight: sl.id === lesson.id ? 600 : 400 }}>
                    {sl.id === lesson.id ? '🔵' : '⚪'} {sl.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
