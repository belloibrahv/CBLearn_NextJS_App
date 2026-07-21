'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function TopNav({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  const isAdmin = user?.role === 'admin';
  const links = isAdmin
    ? [{ href: '/admin', label: 'Students', icon: 'group' }]
    : [
        { href: '/dashboard', label: 'Dashboard', icon: 'space_dashboard' },
        { href: '/progress', label: 'My Progress', icon: 'monitoring' },
      ];

  const initials = (user?.fullName || '?')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="md-topbar">
      <div className="md-brand">
        <div className="mark">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>school</span>
        </div>
        CBLearn
      </div>
      <div className="md-nav">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={pathname === l.href ? 'active' : ''}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', background: 'var(--md-sys-color-secondary-container)',
            color: 'var(--md-sys-color-on-secondary-container)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700, fontSize: 12,
          }}>{initials}</div>
          {user?.fullName}
        </div>
        <button onClick={handleLogout} className="md-btn md-btn-text" style={{ color: '#fff', padding: '6px 10px' }} title="Sign out">
          <span className="material-symbols-outlined" style={{ fontSize: 19 }}>logout</span>
        </button>
      </div>
    </div>
  );
}
