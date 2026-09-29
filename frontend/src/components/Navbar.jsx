import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/market-prices', label: 'Market Prices', icon: 'trending_up' },
  { to: '/my-produce', label: 'My Produce', icon: 'agriculture' },
  { to: '/lots', label: 'My Lots', icon: 'inventory_2' },
  { to: '/payments', label: 'Payments', icon: 'payments' },
  { to: '/advanced-analytics', label: 'Analytics', icon: 'analytics' },
  { to: '/inventory', label: 'Inventory', icon: 'inventory' },
  { to: '/resources', label: 'Resources', icon: 'local_shipping' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <header className="bg-[#f4fafd] border-b border-[#c1c8c2] sticky top-0 z-50 w-full">
        <div className="flex justify-between items-center w-full px-4 md:px-10 h-16 max-w-[1440px] mx-auto">
          {/* Brand + Nav Links */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#012d1d] text-2xl fill-icon">agriculture</span>
              <span className="font-display text-[22px] font-bold text-[#012d1d]">e-Mandi</span>
            </Link>
            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-1 items-center h-16">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `h-full flex items-center px-3 font-body-sm font-medium border-b-2 transition-colors duration-150 ${
                      isActive
                        ? 'text-[#012d1d] font-semibold border-[#012d1d]'
                        : 'text-[#414844] border-transparent hover:text-[#012d1d]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right: Notifications + Profile */}
          <div className="flex items-center gap-3">
            <Link
              to="/notifications"
              className="p-2 text-[#414844] hover:text-[#012d1d] transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </Link>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 cursor-pointer"
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-label-md text-sm font-bold">
                  {user?.initials || 'RK'}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="font-body-sm font-semibold text-[#012d1d] leading-tight">{user?.name || 'Ramesh Kumar'}</span>
                  <span className="text-[11px] text-[#414844] leading-tight">{user?.role || 'Farmer'}</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#414844] hidden md:block">expand_more</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#c1c8c2] rounded-lg shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#c1c8c2] bg-[#eef5f7]">
                    <p className="font-body-sm font-semibold text-[#012d1d]">{user?.name}</p>
                    <p className="text-xs text-[#414844]">{user?.id}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 font-body-sm text-[#161d1f] hover:bg-[#eef5f7] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                    Profile & Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 font-body-sm text-[#ba1a1a] hover:bg-[#ffdad6] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-[#414844] hover:text-[#012d1d]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#c1c8c2] bg-white">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 font-body-sm border-l-4 transition-colors ${
                    isActive
                      ? 'text-[#012d1d] font-semibold border-[#012d1d] bg-[#eef5f7]'
                      : 'text-[#414844] border-transparent hover:bg-[#f4fafd]'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
            <div className="px-6 py-3 border-t border-[#c1c8c2]">
              <Link
                to="/register-produce"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2 bg-[#1b4332] text-white font-label-md rounded"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Register Produce
              </Link>
            </div>
            <div className="px-6 py-3 border-t border-[#c1c8c2]">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-[#ba1a1a] font-body-sm"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Overlay for profile dropdown */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileOpen(false)}
        />
      )}
    </>
  );
}
