import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Home,
  Building2,
  BarChart3,
  Users,
  FileText,
  Calendar,
  DollarSign,
  Menu,
  X,
} from 'lucide-react';

export function Navigation() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: '/marketplace', label: 'Phòng trọ' },
    ...(profile?.role === 'sale' || profile?.role === 'owner' || profile?.role === 'admin'
      ? [
          { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
          ...(profile.role === 'sale'
            ? [
                { href: '/leads', label: 'Khách hàng', icon: Users },
                { href: '/appointments', label: 'Lịch hẹn', icon: Calendar },
                { href: '/commissions', label: 'Hoa hồng', icon: DollarSign },
              ]
            : []),
          ...(profile.role === 'owner'
            ? [
                { href: '/buildings', label: 'Tòa nhà', icon: Building2 },
                { href: '/rooms', label: 'Phòng', icon: Home },
                { href: '/sales', label: 'Sales', icon: Users },
                { href: '/deposits', label: 'Cọc', icon: FileText },
              ]
            : []),
          ...(profile.role === 'admin'
            ? [
                { href: '/admin/users', label: 'Người dùng', icon: Users },
                { href: '/admin/verifications', label: 'Xác thực', icon: FileText },
              ]
            : []),
        ]
      : []),
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left - Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">RentalFlow</span>
            </Link>
          </div>

          {/* Center - Search (Desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm phòng theo khu vực, giá, diện tích..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-4 w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Right - Auth Buttons / User Menu */}
          <div className="flex items-center gap-2">
            {/* Mobile search toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            {!user ? (
              <div className="flex items-center gap-2">
                <Link to="/auth?mode=login&auth=true" className="btn-ghost hidden sm:inline-flex">
                  Đăng nhập
                </Link>
                <Link
                  to="/auth?mode=register&auth=true"
                  className="btn-primary"
                >
                  Đăng ký
                </Link>
              </div>
            ) : (
              <>
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <User className="w-4 h-4 text-primary-600" />
                      )}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                      {profile?.full_name || 'User'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="dropdown-menu animate-slide-down">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                        <p className="text-xs text-gray-500">{profile?.email}</p>
                        <span className="badge-primary mt-2">
                          {profile?.role === 'customer' ? 'Khách hàng' :
                           profile?.role === 'sale' ? 'Sale' :
                           profile?.role === 'owner' ? 'Chủ nhà' : 'Admin'}
                        </span>
                      </div>
                      <div className="py-1">
                        <Link to="/profile" className="dropdown-item flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Hồ sơ
                        </Link>
                        <Link to="/settings" className="dropdown-item flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Cài đặt
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={signOut}
                          className="dropdown-item flex items-center gap-2 text-error-600 hover:bg-error-50 w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile menu toggle */}
            {user && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden py-3 border-t border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm phòng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && user && (
          <div ref={mobileMenuRef} className="md:hidden py-3 border-t border-gray-200">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`sidebar-item ${
                      location.pathname === link.href ? 'sidebar-item-active' : ''
                    }`}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
