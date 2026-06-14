import { useState } from 'react';
import {
  DollarSign,
  Clock,
  Check,
  TrendingUp,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';
import { formatCurrency, formatDate, COMMISSION_STATUS } from '../../lib/constants';
import { sampleCommissions, sampleRooms, sampleDeposits } from '../../lib/sample-data';
import { Sidebar } from '../../components/layout/Sidebar';

export function CommissionsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'paid'>('pending');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredCommissions = sampleCommissions.filter(
    (comm) => comm.status === activeTab || activeTab === 'paid'
  );

  const summary = {
    total: sampleCommissions.reduce((sum, c) => sum + c.commission_amount, 0),
    pending: sampleCommissions
      .filter((c) => c.status === 'pending')
      .reduce((sum, c) => sum + c.commission_amount, 0),
    paid: sampleCommissions
      .filter((c) => c.status === 'paid')
      .reduce((sum, c) => sum + c.commission_amount, 0),
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hoa hồng</h1>
              <p className="text-sm text-gray-500 mt-1">
                Quản lý thu nhập hoa hồng
              </p>
            </div>
            <button className="btn-secondary">
              <Download className="w-4 h-4 mr-2" />
              Xuất báo cáo
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="stat-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-500">Tổng hoa hồng</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.total)}
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-warning-100 text-warning-600">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-500">Chờ thanh toán</span>
              </div>
              <div className="text-2xl font-bold text-warning-600">
                {formatCurrency(summary.pending)}
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-success-100 text-success-600">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-500">Đã nhận</span>
              </div>
              <div className="text-2xl font-bold text-success-600">
                {formatCurrency(summary.paid)}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="card">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'pending'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Chờ duyệt
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-warning-100 text-warning-700 text-xs">
                    {sampleCommissions.filter((c) => c.status === 'pending').length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'approved'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Đã duyệt
                </button>
                <button
                  onClick={() => setActiveTab('paid')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'paid'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Đã thanh toán
                </button>
              </div>
            </div>

            {/* Commission List */}
            <div className="divide-y divide-gray-100">
              {sampleCommissions.map((comm) => {
                const room = sampleRooms.find((r) => r.id === comm.room_id);
                const deposit = sampleDeposits.find((d) => d.id === comm.deposit_id);

                return (
                  <div key={comm.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            comm.status === 'pending'
                              ? 'bg-warning-100 text-warning-600'
                              : comm.status === 'approved'
                              ? 'bg-primary-100 text-primary-600'
                              : 'bg-success-100 text-success-600'
                          }`}
                        >
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Phòng {room?.room_number || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {room?.building?.name || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(comm.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">
                          {formatCurrency(comm.commission_amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {comm.commission_rate}% hoa hồng
                        </p>
                        <span
                          className={`badge mt-2 ${
                            comm.status === 'pending'
                              ? 'badge-warning'
                              : comm.status === 'approved'
                              ? 'badge-primary'
                              : 'badge-success'
                          }`}
                        >
                          {comm.status === 'pending'
                            ? 'Chờ duyệt'
                            : comm.status === 'approved'
                            ? 'Đã duyệt'
                            : 'Đã thanh toán'}
                        </span>
                      </div>
                    </div>

                    {comm.status === 'pending' && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end gap-2">
                        <button className="btn-sm btn-secondary">
                          Chi tiết
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {sampleCommissions.length === 0 && (
                <div className="p-12 text-center">
                  <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">Không có hoa hồng nào</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
