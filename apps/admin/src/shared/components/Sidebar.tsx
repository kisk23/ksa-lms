import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/users', label: 'Users', icon: '👥' },
  { href: '/courses', label: 'Courses', icon: '📚' },
  { href: '/reports', label: 'Reports', icon: '📈' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <h2>LMS Admin</h2>
      </div>
      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="sidebar__link">
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
