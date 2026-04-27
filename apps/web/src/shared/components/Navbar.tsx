import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link href="/">LMS</Link>
      </div>
      <div className="navbar__links">
        <Link href="/courses">Courses</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
      <div className="navbar__auth">
        <Link href="/login">Sign In</Link>
        <Link href="/register" className="btn-primary">Get Started</Link>
      </div>
    </nav>
  );
}
