const { NextResponse } = require('next/server');
const { cookies } = require('next/headers');
const { query } = require('@/db');
const { verifyPassword, signSession, COOKIE_NAME } = require('@/lib/auth');

exports.POST = async function POST(request) {
  try {
    const body = await request.json();
    const matricNumber = (body.matricNumber || '').trim();
    const password = body.password || '';

    const rows = await query('SELECT * FROM users WHERE matric_number = ?', [matricNumber]);
    const user = rows[0];
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid matriculation number or password.' }, { status: 401 });
    }
    
    const passwordValid = verifyPassword(password, user.password_hash);
    
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid matriculation number or password.' }, { status: 401 });
    }

    const token = signSession({ userId: user.id, role: user.role, fullName: user.full_name });
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });

    return NextResponse.json({ ok: true, user: { id: user.id, fullName: user.full_name, matricNumber: user.matric_number, role: user.role } });
  } catch (e) {
    console.error('Login error:', e);
    console.error('Error stack:', e.stack);
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
  }
};
