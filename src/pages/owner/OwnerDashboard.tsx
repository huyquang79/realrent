import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  DoorOpen,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Bell,
  ChevronRight,
  Check,
  Clock,
  AlertCircle,
  PieChart,
} from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '../../lib/constants';
import { sampleRooms, sampleDeposits, sampleBuildings } from '../../lib/sample-data';
import { Sidebar } from '../../components/layout/Sidebar';
import { useAuth } from '../../lib/auth-context';

export function OwnerDashboard() {
  const { profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const rooms = sampleRooms;
  const buildings = sampleBuildings;

  const stats = [
    {
      label: 'Tỷ lệ lấp đầy',
      value: '75%',
      change: '+2%',
      changeType: 'up',
      icon: PieChart,
      color: 'primary',
    },
    {
      label: 'Phòng trống',
      value: rooms.filter((r) => r.status === 'available').length.toString(),
      change: '-3',
      changeType: 'down',
      icon: DoorOpen,
      color: 'warning',
    },
    {
      label: 'Đã cọc',
      value: rooms.filter((r) => r.status === 'deposited').length.toString(),
      change: '+2',
      changeType: 'up',
      icon: Clock,
      color: 'warning',
    },
    {
      label: 'Đã thuê',
      value: rooms.filter((r) => r.status === 'rented').length.toString(),
      change: '+8',
      changeType: 'up',
      icon: Check,
      color: 'success',
    },
    {
      label: 'Doanh thu tháng',
      value: formatCurrency(85000000),
      change: '+12%',
      changeType: 'up',
      icon: DollarSign,
      color: 'primary',
    },
    {
      label: 'Sales hoạt động',
      value: '5',
      change: '+1',
      changeType: 'up',
      icon: Users,
      color: 'success',
    },
  ];

  const pendingDeposits = sampleDeposits.filter((d) => d.status === 'pending');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Xin chào, {profile?.full_name || 'Chủ nhà'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="stat-card">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2 rounded-lg ${
                        stat.color === 'primary'
                          ? 'bg-primary-100 text-primary-600'
                          : stat.color === 'success'
                          ? 'bg-success-100 text-success-600'
                          : stat.color === 'warning'
                          ? 'bg-warning-100 text-warning-600'
                          : stat.color === 'error'
                          ? 'bg-error-100 text-error-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {stat.change && (
                      <span
                        className={`text-xs font-medium flex items-center gap-0.5 ${
                          stat.changeType === 'up' ? 'text-success-600' : 'text-error-600'
                        }`}
                      >
                        {stat.changeType === 'up' ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Buildings Overview */}
            <div className="card">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Tòa nhà</h2>
                <Link
                  to="/buildings"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  Xem tất cả
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="p-4 space-y-3">
                {buildings.slice(0, 4).map((building) => (
                  <div
                    key={building.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{building.name}</p>
                      <p className="text-sm text-gray-500">{building.district}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{building.occupancy_rate}%</p>
                      <p className="text-xs text-gray-500">Tỷ lệ lấp</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Deposits */}
            <div className="card">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Yêu cầu duyệt cọc</h2>
                <Link
                  to="/deposits"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  Xem tất cả
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="p-4">
                {pendingDeposits.length > 0 ? (
                  <div className="space-y-3">
                    {pendingDeposits.map((deposit) => {
                      const room = rooms.find((r) => r.id === deposit.room_id);
                      return (
                        <div
                          key={deposit.id}
                          className="flex items-center gap-4 p-3 bg-warning-50 rounded-lg border border-warning-200"
                        >
                          <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-warning-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{deposit.customer_name}</p>
                            <p className="text-sm text-gray-500">
                              Phòng {room?.room_number} - {formatCurrency(deposit.deposit_amount)}
                            </p>
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatRelativeTime(deposit.created_at)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Check className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Không có yêu cầu chờ duyệt</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Hoạt động gần đây</h2>
              <Link
                to="/activity"
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                Xem nhật ký
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {[
                  { icon: Check, text: 'Phòng 305 đã được duyệt cọc', time: '5 phút trước' },
                  { icon: Calendar, text: 'Lịch xem phòng mới: Phòng 505', time: '15 phút trước' },
                  { icon: Users, text: 'Sale Nguyễn Văn A đã ứng tuyển', time: '1 giờ trước' },
                  { icon: DollarSign, text: 'Hoa hồng đã thanh toán: 550,000đ', time: '2 giờ trước' },
                ].map((activity, i) => {
                  const Icon = activity.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{activity.text}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
