const { NextResponse } = require('next/server');
const { getCurrentUser } = require('@/lib/session');
const { query } = require('@/db');

exports.GET = async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 });
  }

  const students = await query("SELECT id, full_name, matric_number, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC", []);
  const totalModules = (await query('SELECT COUNT(*) AS c FROM modules', []))[0].c;

  const rows = [];
  for (const s of students) {
    const results = await query('SELECT score FROM results WHERE user_id = ?', [s.id]);
    const completedModules = (await query("SELECT COUNT(*) AS c FROM progress WHERE user_id = ? AND status = 'completed'", [s.id]))[0].c;
    const avgScore = results.length > 0 ? Math.round((results.reduce((a, r) => a + r.score, 0) / results.length) * 10) / 10 : null;
    rows.push({
      id: s.id,
      fullName: s.full_name,
      matricNumber: s.matric_number,
      modulesCompleted: completedModules,
      totalModules,
      avgScore,
      quizzesTaken: results.length,
    });
  }

  const allAvg = rows.filter((r) => r.avgScore != null).map((r) => r.avgScore);
  const platformAvg = allAvg.length > 0 ? Math.round((allAvg.reduce((a, b) => a + b, 0) / allAvg.length) * 10) / 10 : 0;

  return NextResponse.json({ students: rows, totalStudents: students.length, totalModules, platformAvg });
};
