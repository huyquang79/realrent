import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Phone,
  Mail,
  Calendar,
  MoreVertical,
  ChevronDown,
  User,
  Building2,
  Clock,
  Check,
  AlertCircle,
  X,
} from 'lucide-react';
import { formatRelativeTime, formatDateTime } from '../../lib/constants';
import { sampleLeads, sampleRooms } from '../../lib/sample-data';
import { Sidebar } from '../../components/layout/Sidebar';
import { Modal } from '../../components/ui/Modal';

const LEAD_STATUSES = [
  { value: 'new', label: 'Lead mới', color: 'bg-primary-100 text-primary-700' },
  { value: 'consulting', label: 'Đang tư vấn', color: 'bg-gray-100 text-gray-700' },
  { value: 'scheduled', label: 'Đã đặt lịch', color: 'bg-warning-100 text-warning-700' },
  { value: 'viewed', label: 'Đã xem phòng', color: 'bg-blue-100 text-blue-700' },
  { value: 'deposited', label: 'Đã cọc', color: 'bg-orange-100 text-orange-700' },
  { value: 'success', label: 'Thành công', color: 'bg-success-100 text-success-700' },
  { value: 'cancelled', label: 'Hủy', color: 'bg-error-100 text-error-700' },
] as const;

export function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredLeads = sampleLeads.filter((lead) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !lead.customer_name.toLowerCase().includes(query) &&
        !lead.customer_phone.includes(query)
      ) {
        return false;
      }
    }
    if (selectedStatus && lead.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const getLeadsByStatus = (status: string) =>
    filteredLeads.filter((lead) => lead.status === status);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Leads</h1>
              <p className="text-sm text-gray-500 mt-1">
                Theo dõi khách hàng và tiềm năng
              </p>
            </div>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Thêm Lead
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Tìm theo tên, SĐT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <select
              value={selectedStatus || ''}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              className="input w-auto"
            >
              <option value="">Tất cả trạng thái</option>
              {LEAD_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-x-auto">
            {LEAD_STATUSES.slice(0, 6).map((status) => {
              const leads = getLeadsByStatus(status.value);
              return (
                <div key={status.value} className="min-w-[280px]">
                  {/* Column Header */}
                  <div
                    className={`flex items-center justify-between px-3 py-2 rounded-lg mb-3 ${status.color}`}
                  >
                    <div className="flex items-center gap-2">
                      {status.value === 'success' && <Check className="w-4 h-4" />}
                      {status.value === 'cancelled' && <X className="w-4 h-4" />}
                      <span className="font-medium">{status.label}</span>
                    </div>
                    <span className="text-sm font-medium">{leads.length}</span>
                  </div>

                  {/* Column Cards */}
                  <div className="space-y-3">
                    {leads.map((lead) => {
                      const room = sampleRooms.find((r) => r.id === lead.room_id);
                      return (
                        <div
                          key={lead.id}
                          className="kanban-card"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-gray-900">{lead.customer_name}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Phone className="w-3 h-3" />
                                {lead.customer_phone}
                              </div>
                            </div>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>

                          {room && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                              <Building2 className="w-3 h-3" />
                              Phòng {room.room_number} - {room.building?.district}
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(lead.last_contacted_at || lead.created_at)}
                          </div>

                          <div className="flex gap-2 mt-3">
                            <a
                              href={`tel:${lead.customer_phone}`}
                              className="btn-sm btn-secondary flex-1"
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                            <Link
                              to={`/appointments?new=${lead.id}`}
                              className="btn-sm btn-primary flex-1"
                            >
                              <Calendar className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                    {leads.length === 0 && (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        Không có lead
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Thêm Lead mới"
      >
        <form className="space-y-4">
          <div>
            <label className="label">Họ tên khách hàng</label>
            <input type="text" className="input" placeholder="Nguyễn Văn A" />
          </div>
          <div>
            <label className="label">Số điện thoại</label>
            <input type="tel" className="input" placeholder="0912345678" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" placeholder="email@example.com" />
          </div>
          <div>
            <label className="label">Nguồn</label>
            <select className="input">
              <option value="website">Website</option>
              <option value="facebook">Facebook</option>
              <option value="referral">Giới thiệu</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div>
            <label className="label">Ghi chú</label>
            <textarea className="input" rows={3} placeholder="Ghi chú về khách hàng..." />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="btn-secondary flex-1"
            >
              Hủy
            </button>
            <button type="submit" className="btn-primary flex-1">
              Thêm Lead
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
