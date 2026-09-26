import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Search, User as UserIcon, LogOut, Shield, Compass, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    toast.success('Berhasil keluar dari akun');
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl gradient-btn flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight gradient-text">EVTIK</span>
            <span className="block text-[10px] tracking-widest uppercase font-semibold text-slate-400">Digital Ticketing</span>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Cari konser, workshop, webinar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </form>

        {/* Right Navigation */}
        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-slate-800/50"
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            Jelajah Event
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 pl-3 rounded-full glass-card hover:border-indigo-500/50 transition-all focus:outline-none"
              >
                <div className="text-right hidden sm:block">
                  <span className="block text-xs font-semibold text-slate-200">{user?.name}</span>
                  <span className="block text-[10px] text-indigo-400 font-medium capitalize">{user?.role.toLowerCase()}</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </button>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl shadow-2xl py-2 border border-slate-700/80 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="text-xs font-semibold text-slate-200">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-indigo-600/20 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-indigo-400" />
                    Dashboard Akun
                  </Link>

                  {user?.role === 'ORGANIZER' && (
                    <Link
                      to="/create-event"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-indigo-600/20 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-purple-400" />
                      Buat Event Baru
                    </Link>
                  )}

                  {user?.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-indigo-600/20 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      Panel Admin
                    </Link>
                  )}

                  <div className="my-1 border-t border-slate-800"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-4 py-2.5 rounded-xl hover:bg-slate-800/60"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="gradient-btn text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
              >
                Daftar Gratis
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
