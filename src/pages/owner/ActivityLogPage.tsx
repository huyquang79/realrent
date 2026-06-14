import { useState } from 'react';
import { Activity, Filter, Calendar, User, Building2, DollarSign, Check, FileText, AlertCircle } from 'lucide-react';
import { formatDateTime, formatRelativeTime } from '../../lib/constants';
import { Sidebar } from '../../components/layout/Sidebar';

const activityTypes = [
  { value: 'all', label: 'Tất cả' },
  { value: 'room', label: 'Phòng' },
  { value: 'lead', label: 'Khách hàng' },
  { value: 'appointment', label: 'Lịch hẹn' },
  { value: 'deposit', label: 'Cọc' },
  { value: 'commission', label: 'Hoa hồng' },
];

const sampleActivities = [
  {
    id: '1',
    type: 'deposit',
    action: 'Phòng 305 đã được duyệt cọc',
    description: 'Khách hàng Nguyễn Văn H, 5,000,000đ',
    user: 'Bạn',
    entity_type: 'room',
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'appointment',
    action: 'Lịch xem phòng mới',
    description: 'Khách H Trần Thị B đặt lịch xem phòng 505',
    user: 'Sale Nguyễn Văn A',
    entity_type: 'appointment',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'lead',
    action: 'Lead mới được tạo',
    description: 'Khách hàng Lê Văn C, SĐT: 0912345678',
    user: 'Sale Nguyễn Văn A',
    entity_type: 'lead',
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'commission',
    action: 'Hoa hồng đã thanh toán',
    description: '550,000đ - Phòng 401, Sale Nguyễn Văn A',
    user: 'Bạn',
    entity_type: 'commission',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: 'room',
    action: 'Phòng mới được tạo',
    description: 'Phòng 601 - Tòa nhà Cầu Giấy, 4,500,000đ/tháng',
    user: 'Bạn',
    entity_type: 'room',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    type: 'deposit',
    action: 'Yêu cầu đặt cọc mới',
    description: 'Khách Phạm Văn E, Phòng 102, 3,500,000đ',
    user: 'Sale Trần Thị B',
    entity_type: 'deposit',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    type: 'room',
    action: 'Trạng thái phòng thay đổi',
    description: 'Phòng 201 chuyển từ "Còn trống" sang "Đã thuê"',
    user: 'Bạn',
    entity_type: 'room',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const typeIcons: Record<string, any> = {
  room: Building2,
  lead: User,
  appointment: Calendar,
  deposit: FileText,
  commission: DollarSign,
};

const typeColors: Record<string, string> = {
  room: 'bg-primary-100 text-primary-600',
  lead: 'bg-gray-100 text-gray-600',
  appointment: 'bg-warning-100 text-warning-600',
  deposit: 'bg-success-100 text-success-600',
  commission: 'bg-blue-100 text-blue-600',
};

export function ActivityLogPage() {
  const [filter, setFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredActivities = sampleActivities.filter(
    (activity) => filter === 'all' || activity.type === filter
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nhật ký hoạt động</h1>
              <p className="text-sm text-gray-500 mt-1">
                Lịch sử tất cả hoạt động trên hệ thống
              </p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            {activityTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                className={`btn-sm ${
                  filter === type.value ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="p-6">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-1">
              {filteredActivities.map((activity, index) => {
                const Icon = typeIcons[activity.type] || Activity;
                const colorClass = typeColors[activity.type] || 'bg-gray-100 text-gray-600';

                return (
                  <div key={activity.id} className="relative">
                    {/* Timeline Line */}
                    {index < filteredActivities.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200" />
                    )}

                    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="font-medium text-gray-900">{activity.action}</h3>
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {formatRelativeTime(activity.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          <span>{activity.user}</span>
                          <span className="text-gray-300">|</span>
                          <span>{formatDateTime(activity.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredActivities.length === 0 && (
              <div className="text-center py-16">
                <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Không có hoạt động
                </h3>
                <p className="text-gray-500">
                  Chưa có hoạt động nào phù hợp với bộ lọc
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
