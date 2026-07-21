const { cookies } = require('next/headers');
const { verifySession, COOKIE_NAME } = require('@/lib/auth');
const { query } = require('@/db');

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifySession(token);
  if (!payload) return null;
  const rows = await query('SELECT id, full_name, matric_number, department, role FROM users WHERE id = ?', [payload.userId]);
  if (!rows[0]) return null;
  return {
    id: rows[0].id,
    fullName: rows[0].full_name,
    matricNumber: rows[0].matric_number,
    department: rows[0].department,
    role: rows[0].role,
  };
}

module.exports = { getCurrentUser };
