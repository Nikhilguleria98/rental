import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Header() {
  const { user, logout, loading } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (loading) {
    return (
      <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="text-xl font-semibold text-slate-900">RentalStay</Link>
          <div className="hidden md:flex items-center gap-4">
            <div className="w-20 h-8 bg-slate-200 animate-pulse rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="text-xl font-semibold text-slate-900">RentalStay</Link>
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
          <Link to="/" className="transition hover:text-slate-900">Home</Link>
          <Link to="/nearby" className="transition hover:text-slate-900">Nearby</Link>
          <Link to="/contact" className="transition hover:text-slate-900">Contact</Link>
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
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200/80">
          <nav className="flex flex-col gap-4 px-6 py-4 text-sm font-medium text-slate-600">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="transition hover:text-slate-900">Home</Link>
            <Link to="/nearby" onClick={() => setIsMenuOpen(false)} className="transition hover:text-slate-900">Nearby</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="transition hover:text-slate-900">Contact</Link>
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="rounded-full bg-cyan-500 px-4 py-2 text-white transition hover:bg-cyan-600 text-center">Admin Panel</Link>
                ) : (
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="rounded-full bg-cyan-500 px-4 py-2 text-white transition hover:bg-cyan-600 text-center">Dashboard</Link>
                )}
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="rounded-full px-4 py-2 text-slate-700 transition hover:bg-slate-100 text-center">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="rounded-full bg-slate-100 px-4 py-2 text-slate-700 transition hover:bg-slate-200 text-center">Log in</Link>
                <Link to="/admin/login" onClick={() => setIsMenuOpen(false)} className="rounded-full bg-slate-100 px-4 py-2 text-slate-700 transition hover:bg-slate-200 text-center">Admin</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
