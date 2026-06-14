import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth-context';
import {
  Home,
  Building2,
  BarChart3,
  Users,
  FileText,
  Calendar,
  DollarSign,
  Shield,
  LayoutGrid,
  TrendingUp,
  Award,
  AlertTriangle,
  Activity,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { profile } = useAuth();
  const location = useLocation();

  if (!profile || profile.role === 'customer') return null;

  const customerLinks = [
    { href: '/marketplace', label: 'Phòng trọ', icon: Home },
    { href: '/favorites', label: 'Yêu thích', icon: Building2 },
  ];

  const saleLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/leads', label: 'Quản lý Leads', icon: Users },
    { href: '/appointments', label: 'Lịch xem phòng', icon: Calendar },
    { href: '/commissions', label: 'Hoa hồng', icon: DollarSign },
    { href: '/ranking', label: 'Xếp hạng', icon: Award },
    { href: '/marketplace', label: 'Phòng trọ', icon: Home },
  ];

  const ownerLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/buildings', label: 'Tòa nhà', icon: Building2 },
    { href: '/rooms', label: 'Phòng trọ', icon: LayoutGrid },
    { href: '/sales', label: 'Quản lý Sale', icon: Users },
    { href: '/deposits', label: 'Duyệt cọc', icon: FileText },
    { href: '/commissions', label: 'Hoa hồng', icon: DollarSign },
    { href: '/disputes', label: 'Tranh chấp', icon: AlertTriangle },
    { href: '/activity', label: 'Nhật ký', icon: Activity },
    { href: '/analytics', label: 'Phân tích', icon: TrendingUp },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin/users', label: 'Người dùng', icon: Users },
    { href: '/admin/verifications', label: 'Xác thực', icon: Shield },
    { href: '/admin/owners', label: 'Chủ nhà', icon: Building2 },
    { href: '/admin/sales', label: 'Sales', icon: Users },
    { href: '/admin/disputes', label: 'Tranh chấp', icon: AlertTriangle },
    { href: '/admin/reports', label: 'Báo cáo', icon: FileText },
  ];

  let links = customerLinks;
  if (profile.role === 'sale') links = saleLinks;
  if (profile.role === 'owner') links = ownerLinks;
  if (profile.role === 'admin') links = adminLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-16 left-0 z-40
          w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200
          overflow-y-auto
          transition-transform duration-200 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 space-y-1">
          <div className="p-3 mb-4 bg-primary-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Vai trò hiện tại</p>
            <p className="text-sm font-semibold text-primary-600">
              {profile.role === 'customer' ? 'Khách hàng' :
               profile.role === 'sale' ? 'Nhân viên Sale' :
               profile.role === 'owner' ? 'Chủ nhà' : 'Quản trị viên'}
            </p>
          </div>

          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;

            return (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={onClose}
                className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </NavLink>
            );
          })}
        </div>
      </aside>
    </>
  );
}
