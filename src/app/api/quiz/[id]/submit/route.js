const { NextResponse } = require('next/server');
const { getCurrentUser } = require('@/lib/session');
const { query, insertReturningId } = require('@/db');

exports.POST = async function POST(request, context) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const { id: quizId } = await context.params;
  const body = await request.json();
  const answers = body.answers || {}; // { questionId: selectedIndex }

  const quizRows = await query('SELECT * FROM quizzes WHERE id = ?', [quizId]);
  const quiz = quizRows[0];
  if (!quiz) return NextResponse.json({ error: 'Quiz not found.' }, { status: 404 });

  const questions = await query('SELECT * FROM questions WHERE quiz_id = ? ORDER BY sequence_no ASC', [quizId]);

  let correctCount = 0;
  const feedback = questions.map((q) => {
    const selected = answers[q.id];
    const isCorrect = Number(selected) === Number(q.correct_option);
    if (isCorrect) correctCount += 1;
    return {
      questionId: q.id,
      selected: selected === undefined ? null : Number(selected),
      correctOption: Number(q.correct_option),
      isCorrect,
    };
  });

  const totalCount = questions.length;
  const score = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

  await insertReturningId(
    'results',
    ['user_id', 'quiz_id', 'score', 'correct_count', 'total_count', 'date_taken'],
    [user.id, quizId, score, correctCount, totalCount, Date.now()]
  );

  // Update module progress: mark in_progress, or completed if every lesson in the module has a result
  const lessonRows = await query('SELECT module_id FROM lessons WHERE id = ?', [quiz.lesson_id]);
  const moduleId = lessonRows[0]?.module_id;
  if (moduleId) {
    const allLessonsInModule = await query('SELECT id FROM lessons WHERE module_id = ?', [moduleId]);
    const lessonIds = allLessonsInModule.map((l) => l.id);
    const quizzesInModule = await query(
      `SELECT id, lesson_id FROM quizzes WHERE lesson_id IN (${lessonIds.map(() => '?').join(',') || 'NULL'})`,
      lessonIds
    );
    const userResults = await query('SELECT DISTINCT quiz_id FROM results WHERE user_id = ?', [user.id]);
    const attemptedQuizIds = new Set(userResults.map((r) => r.quiz_id));
    const allAttempted = quizzesInModule.length > 0 && quizzesInModule.every((q) => attemptedQuizIds.has(q.id));
    const status = allAttempted ? 'completed' : 'in_progress';

    const existingProgress = await query('SELECT id FROM progress WHERE user_id = ? AND module_id = ?', [user.id, moduleId]);
    if (existingProgress[0]) {
      await query('UPDATE progress SET status = ?, updated_at = ? WHERE id = ?', [status, Date.now(), +existingProgress[0].id]);
    } else {
      await insertReturningId('progress', ['user_id', 'module_id', 'status', 'updated_at'], [user.id, moduleId, status, Date.now()]);
    }
  }

  return NextResponse.json({
    correctCount,
    totalCount,
    score: Math.round(score * 10) / 10,
    passed: score >= quiz.pass_mark,
    feedback,
  });
};
