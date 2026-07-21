const { NextResponse } = require('next/server');
const { getCurrentUser } = require('@/lib/session');
const { query } = require('@/db');

exports.GET = async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

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
    if (!byModule[h.module_title] || h.score > byModule[h.module_title]) {
      byModule[h.module_title] = h.score;
    }
  });

  return NextResponse.json({
    history: history.map((h) => ({
      id: h.id,
      quizTitle: h.quiz_title,
      lessonTitle: h.lesson_title,
      moduleTitle: h.module_title,
      score: Math.round(h.score * 10) / 10,
      correctCount: h.correct_count,
      totalCount: h.total_count,
      dateTaken: h.date_taken,
    })),
    scoresByModule: Object.entries(byModule).map(([moduleTitle, score]) => ({ moduleTitle, score: Math.round(score) })),
  });
};
