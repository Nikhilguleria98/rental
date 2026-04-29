import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="text-xl font-semibold text-slate-900">RentalStay</Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <Link to="/" className="transition hover:text-slate-900">Home</Link>
          <a href="#nearby" className="transition hover:text-slate-900">Nearby</a>
          <a href="#contact" className="transition hover:text-slate-900">Contact</a>
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin/dashboard" className="rounded-full bg-cyan-500 px-4 py-2 text-white transition hover:bg-cyan-600">Admin Panel</Link>
              ) : (
                <Link to="/dashboard" className="rounded-full bg-cyan-500 px-4 py-2 text-white transition hover:bg-cyan-600">Dashboard</Link>
              )}
              <button onClick={logout} className="rounded-full px-4 py-2 text-slate-700 transition hover:bg-slate-100">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full bg-slate-100 px-4 py-2 text-slate-700 transition hover:bg-slate-200">Log in</Link>
              <Link to="/admin/login" className="rounded-full bg-slate-100 px-4 py-2 text-slate-700 transition hover:bg-slate-200">Admin</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
