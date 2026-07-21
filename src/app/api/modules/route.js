const { NextResponse } = require('next/server');
const { getCurrentUser } = require('@/lib/session');
const { query } = require('@/db');

exports.GET = async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const modules = await query('SELECT * FROM modules ORDER BY sequence_no ASC', []);
  const progressRows = await query('SELECT * FROM progress WHERE user_id = ?', [user.id]);
  const progressMap = {};
  progressRows.forEach((p) => { progressMap[p.module_id] = p; });

  const results = await query(
    `SELECT r.*, q.lesson_id FROM results r JOIN quizzes q ON r.quiz_id = q.id WHERE r.user_id = ?`,
    [user.id]
  );
  const lessons = await query('SELECT id, module_id FROM lessons', []);
  const lessonToModule = {};
  lessons.forEach((l) => { lessonToModule[l.id] = l.module_id; });

  const bestScoreByModule = {};
  results.forEach((r) => {
    const modId = lessonToModule[r.lesson_id];
    if (modId == null) return;
    if (!bestScoreByModule[modId] || r.score > bestScoreByModule[modId]) {
      bestScoreByModule[modId] = r.score;
    }
  });

  const enriched = modules.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    status: progressMap[m.id]?.status || 'not_started',
    bestScore: bestScoreByModule[m.id] != null ? Math.round(bestScoreByModule[m.id]) : null,
  }));

  const completedCount = enriched.filter((m) => m.status === 'completed').length;
  const overallProgress = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;
  const allScores = results.map((r) => r.score);
  const avgScore = allScores.length > 0 ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10 : null;

  return NextResponse.json({ modules: enriched, overallProgress, avgScore, quizzesTaken: allScores.length });
};
