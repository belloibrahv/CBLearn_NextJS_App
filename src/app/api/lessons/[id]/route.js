const { NextResponse } = require('next/server');
const { getCurrentUser } = require('@/lib/session');
const { query } = require('@/db');

exports.GET = async function GET(request, context) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const { id } = await context.params;
  const lessonRows = await query('SELECT * FROM lessons WHERE id = ?', [id]);
  const lesson = lessonRows[0];
  if (!lesson) return NextResponse.json({ error: 'Lesson not found.' }, { status: 404 });

  const moduleRows = await query('SELECT * FROM modules WHERE id = ?', [lesson.module_id]);
  const siblingLessons = await query('SELECT id, title, sequence_no FROM lessons WHERE module_id = ? ORDER BY sequence_no ASC', [lesson.module_id]);

  const quizRows = await query('SELECT * FROM quizzes WHERE lesson_id = ?', [id]);
  const quiz = quizRows[0] || null;
  let questions = [];
  if (quiz) {
    const qRows = await query('SELECT id, question_text, options, sequence_no FROM questions WHERE quiz_id = ? ORDER BY sequence_no ASC', [quiz.id]);
    questions = qRows.map((q) => ({
      id: q.id,
      questionText: q.question_text,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      sequenceNo: q.sequence_no,
    }));
  }

  return NextResponse.json({
    lesson,
    module: moduleRows[0] || null,
    siblingLessons,
    quiz: quiz ? { id: quiz.id, title: quiz.title, passMark: quiz.pass_mark, questions } : null,
  });
};
