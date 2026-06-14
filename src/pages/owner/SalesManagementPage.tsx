import { useState } from 'react';
import { Search, UserCheck, Star, DollarSign, TrendingUp, MoreVertical, Check, X, ChevronDown } from 'lucide-react';
import { sampleSales } from '../../lib/sample-data';
import { SALE_RANKS, SALE_RANK_ICONS, formatCurrency } from '../../lib/constants';
import { Sidebar } from '../../components/layout/Sidebar';
import { Modal } from '../../components/ui/Modal';

export function SalesManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<typeof sampleSales[0] | null>(null);

  const filteredSales = sampleSales.filter((sale) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!sale.name.toLowerCase().includes(query)) return false;
    }
    // Additional filters would be applied here
    return true;
  });

  const pendingApplications = filteredSales.filter((s) => s.rank === 'ctv');
  const activeSales = filteredSales.filter((s) => s.rank !== 'ctv');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Sale</h1>
              <p className="text-sm text-gray-500 mt-1">
                Xét duyệt và quản lý nhân viên Sale
              </p>
            </div>
          </div>
        </div>

        {/* Tabs & Search */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={() => setFilterStatus('all')}
                className={`btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Tất cả ({filteredSales.length})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`btn-sm ${filterStatus === 'pending' ? 'btn-warning' : 'btn-secondary'}`}
              >
                Chờ duyệt ({pendingApplications.length})
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`btn-sm ${filterStatus === 'active' ? 'btn-success' : 'btn-secondary'}`}
              >
                Đang hoạt động ({activeSales.length})
              </button>
            </div>

            <div className="relative w-64">
              <input
                type="text"
                placeholder="Tìm Sale..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Pending Applications */}
          {pendingApplications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Yêu cầu ứng tuyển mới</h2>
              <div className="space-y-4">
                {pendingApplications.map((sale) => (
                  <div key={sale.id} className="card p-4 border-warning-200 bg-warning-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
                          {sale.avatar ? (
                            <img src={sale.avatar} alt={sale.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 text-xl font-bold">
                              {sale.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{sale.name}</h3>
                          <p className="text-sm text-gray-500">{sale.phone}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm text-gray-600">{sale.rating}</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-sm text-gray-600">{sale.successful_deals} giao dịch</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right mr-4">
                          <div className="text-sm text-gray-500">Commission đề xuất</div>
                          <div className="font-bold text-gray-900">10%</div>
                        </div>
                        <button className="btn-success">
                          <Check className="w-4 h-4 mr-2" />
                          Duyệt
                        </button>
                        <button className="btn-error btn-sm">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Sales */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sale đang hoạt động</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSales.map((sale) => {
                const rankConfig = SALE_RANKS.find((r) => r.value === sale.rank);
                return (
                  <div key={sale.id} className="card p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          {sale.avatar ? (
                            <img src={sale.avatar} alt={sale.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 text-lg font-bold">
                              {sale.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{sale.name}</h3>
                          <p className="text-xs text-gray-500">{sale.phone}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg">{SALE_RANK_ICONS[sale.rank]}</span>
                            <span className={`badge text-xs bg-${sale.rank === 'gold' ? 'yellow' : sale.rank === 'platinum' ? 'cyan' : 'gray'}-100 text-${sale.rank === 'gold' ? 'yellow' : sale.rank === 'platinum' ? 'cyan' : 'gray'}-700`}>
                              {rankConfig?.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-yellow-500" />
                          <span className="font-bold text-gray-900">{sale.rating}</span>
                        </div>
                        <div className="text-xs text-gray-500">Đánh giá</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-900">{sale.successful_deals}</div>
                        <div className="text-xs text-gray-500">Giao dịch</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-success-600">{sale.response_rate}%</div>
                        <div className="text-xs text-gray-500">Phản hồi</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="btn-secondary flex-1"
                      >
                        Chi tiết
                      </button>
                      <button className="btn-primary flex-1">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Commission
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
