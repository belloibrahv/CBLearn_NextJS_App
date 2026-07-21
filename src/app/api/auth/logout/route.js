const { NextResponse } = require('next/server');
const { cookies } = require('next/headers');
const { COOKIE_NAME } = require('@/lib/auth');

exports.POST = async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ ok: true });
};
