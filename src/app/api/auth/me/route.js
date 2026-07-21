const { NextResponse } = require('next/server');
const { getCurrentUser } = require('@/lib/session');

exports.GET = async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user });
};
