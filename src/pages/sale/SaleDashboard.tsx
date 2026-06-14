import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Clock,
  Check,
  AlertCircle,
  Star,
  Target,
  Award,
} from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { formatCurrency, formatDateTime, formatRelativeTime } from '../../lib/constants';
import { sampleLeads, sampleAppointments, sampleCommissions } from '../../lib/sample-data';
import { Navigation } from '../../components/layout/Navigation';
import { Sidebar } from '../../components/layout/Sidebar';

export function SaleDashboard() {
  const { profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { label: 'Lead mới', value: 12, icon: Users, color: 'primary' },
    { label: 'Đang tư vấn', value: 8, icon: Clock, color: 'gray' },
    { label: 'Đã xem phòng', value: 5, icon: Check, color: 'success' },
    { label: 'Đã cọc', value: 2, icon: AlertCircle, color: 'warning' },
    { label: 'Thành công', value: 15, icon: Target, color: 'success' },
    { label: 'Hoa hồng chờ', value: 5400000, icon: DollarSign, color: 'primary' },
  ];

  const recentLeads = sampleLeads.slice(0, 5);
  const upcomingAppointments = sampleAppointments.filter(
    (a) => a.status === 'scheduled'
  );

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
                Xin chào, {profile?.full_name || 'Sale'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {typeof stat.value === 'number'
                      ? stat.value >= 1000000
                        ? stat.value.toLocaleString('vi-VN')
                        : stat.value
                      : stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Leads */}
            <div className="card">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Lead gần đây</h2>
                <Link
                  to="/leads"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  Xem tất cả
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{lead.customer_name}</p>
                        <p className="text-sm text-gray-500">{lead.customer_phone}</p>
                      </div>
                      <span
                        className={`badge ${
                          lead.status === 'new'
                            ? 'badge-primary'
                            : lead.status === 'consulting'
                            ? 'badge-gray'
                            : lead.status === 'scheduled'
                            ? 'badge-warning'
                            : 'badge-success'
                        }`}
                      >
                        {lead.status === 'new'
                          ? 'Mới'
                          : lead.status === 'consulting'
                          ? 'Đang tư vấn'
                          : lead.status === 'scheduled'
                          ? 'Đã đặt lịch'
                          : lead.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatRelativeTime(lead.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="card">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Lịch xem phòng</h2>
                <Link
                  to="/appointments"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  Xem tất cả
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{apt.customer_name}</p>
                        <p className="text-sm text-gray-500">{apt.customer_phone}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDateTime(apt.scheduled_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {upcomingAppointments.length === 0 && (
                  <div className="p-8 text-center text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Không có lịch hẹn sắp tới</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">Hiệu suất tháng này</h2>
              <Link
                to="/ranking"
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                Chi tiết
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <Award className="w-10 h-10 mx-auto mb-2 text-yellow-500" />
                <div className="text-3xl font-bold text-gray-900">Gold</div>
                <div className="text-sm text-gray-500">Hạng hiện tại</div>
              </div>
              <div className="text-center">
                <Target className="w-10 h-10 mx-auto mb-2 text-primary-600" />
                <div className="text-3xl font-bold text-gray-900">85%</div>
                <div className="text-sm text-gray-500">Ho thành KPI</div>
              </div>
              <div className="text-center">
                <TrendingUp className="w-10 h-10 mx-auto mb-2 text-success-600" />
                <div className="text-3xl font-bold text-gray-900">32%</div>
                <div className="text-sm text-gray-500">Tỷ giao dịch</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
