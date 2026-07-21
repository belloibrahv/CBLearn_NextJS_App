const { NextResponse } = require('next/server');
const { cookies } = require('next/headers');
const { query, insertReturningId } = require('@/db');
const { hashPassword, signSession, COOKIE_NAME } = require('@/lib/auth');

exports.POST = async function POST(request) {
  try {
    const body = await request.json();
    const fullName = (body.fullName || '').trim();
    const matricNumber = (body.matricNumber || '').trim();
    const department = (body.department || 'Computer Science').trim();
    const password = body.password || '';

    if (!fullName || !matricNumber || !password) {
      return NextResponse.json({ error: 'Full name, matriculation number and password are required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const existing = await query('SELECT id FROM users WHERE matric_number = ?', [matricNumber]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'An account with this matriculation number already exists.' }, { status: 409 });
    }

    const passwordHash = hashPassword(password);
    const userId = await insertReturningId(
      'users',
      ['full_name', 'matric_number', 'department', 'password_hash', 'role', 'created_at'],
      [fullName, matricNumber, department, passwordHash, 'student', Date.now()]
    );

    const token = signSession({ userId, role: 'student', fullName });
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });

    return NextResponse.json({ ok: true, user: { id: userId, fullName, matricNumber, role: 'student' } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
};
