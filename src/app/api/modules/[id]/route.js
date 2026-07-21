const { NextResponse } = require('next/server');
const { getCurrentUser } = require('@/lib/session');
const { query } = require('@/db');

exports.GET = async function GET(request, context) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const { id } = await context.params;
  const modules = await query('SELECT * FROM modules WHERE id = ?', [id]);
  if (!modules[0]) return NextResponse.json({ error: 'Module not found.' }, { status: 404 });

  const lessons = await query('SELECT * FROM lessons WHERE module_id = ? ORDER BY sequence_no ASC', [id]);

  return NextResponse.json({ module: modules[0], lessons });
};
