import { useState } from 'react';
import { Search, AlertCircle, Check, X, FileText, DollarSign, Phone, Mail, Image } from 'lucide-react';
import { sampleDeposits, sampleRooms, sampleSales } from '../../lib/sample-data';
import { formatCurrency, formatDate, DEPOSIT_STATUS } from '../../lib/constants';
import { Sidebar } from '../../components/layout/Sidebar';

export function DepositApprovalPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<typeof sampleDeposits[0] | null>(null);

  const filteredDeposits = sampleDeposits.filter((d) => d.status === activeTab || activeTab === 'approved');

  const pendingCount = sampleDeposits.filter((d) => d.status === 'pending').length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Duyệt cọc</h1>
              <p className="text-sm text-gray-500 mt-1">
                Xét duyệt yêu cầu đặt cọc từ khách hàng
              </p>
            </div>
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-warning-100 rounded-lg text-warning-700">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{pendingCount} yêu cầu chờ duyệt</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-6">
          <div className="flex">
            {[
              { value: 'pending', label: 'Chờ duyệt' },
              { value: 'approved', label: 'Đã duyệt' },
              { value: 'rejected', label: 'Từ chối' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as typeof activeTab)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.value
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.value === 'pending' && pendingCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-warning-100 text-warning-700 text-xs">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Deposit List */}
        <div className="p-6">
          <div className="space-y-4">
            {sampleDeposits.map((deposit) => {
              const room = sampleRooms.find((r) => r.id === deposit.room_id);
              const sale = sampleSales.find((s) => s.id === deposit.sale_id);

              return (
                <div
                  key={deposit.id}
                  className="card p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Status Icon */}
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          deposit.status === 'pending'
                            ? 'bg-warning-100 text-warning-600'
                            : deposit.status === 'approved'
                            ? 'bg-success-100 text-success-600'
                            : 'bg-error-100 text-error-600'
                        }`}
                      >
                        <DollarSign className="w-6 h-6" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{deposit.customer_name}</h3>
                          <span
                            className={`badge ${
                              deposit.status === 'pending'
                                ? 'badge-warning'
                                : deposit.status === 'approved'
                                ? 'badge-success'
                                : 'badge-error'
                            }`}
                          >
                            {deposit.status === 'pending' ? 'Chờ duyệt' : deposit.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {deposit.customer_phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            Phòng {room?.room_number}
                          </div>
                          <div className="font-bold text-primary-600">
                            {formatCurrency(deposit.deposit_amount)}
                          </div>
                          <div className="text-gray-400">
                            {formatDate(deposit.created_at)}
                          </div>
                        </div>

                        {sale && (
                          <div className="mt-2 text-xs text-gray-500">
                            Sale: {sale.name} | {sale.phone}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedDeposit(deposit)}
                        className="btn-secondary btn-sm"
                      >
                        Chi tiết
                      </button>
                      {deposit.status === 'pending' && (
                        <>
                          <button className="btn-success btn-sm">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="btn-error btn-sm">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {sampleDeposits.length === 0 && (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Không có yêu cầu cọc
                </h3>
                <p className="text-gray-500">
                  Tất cả yêu cầu đã được xử lý
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deposit Detail Modal */}
      {selectedDeposit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Chi tiết yêu cầu cọc</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Thông tin khách hàng</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Họ tên</span>
                    <span className="font-medium">{selectedDeposit.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">SĐT</span>
                    <span className="font-medium">{selectedDeposit.customer_phone}</span>
                  </div>
                  {selectedDeposit.customer_email && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email</span>
                      <span className="font-medium">{selectedDeposit.customer_email}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tiền cọc</span>
                    <span className="font-bold text-primary-600">
                      {formatCurrency(selectedDeposit.deposit_amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Room Info */}
              {(() => {
                const room = sampleRooms.find((r) => r.id === selectedDeposit.room_id);
                return room ? (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Phòng</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Số phòng</span>
                        <span className="font-medium">{room.room_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Giá thuê</span>
                        <span className="font-medium">{formatCurrency(room.price)}/tháng</span>
                      </div>
                      {room.building && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tòa nhà</span>
                          <span className="font-medium">{room.building.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Documents */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Giấy tờ</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center mt-1">CCCD mặt trước, mặt sau</div>
              </div>

              {/* Notes */}
              {selectedDeposit.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Ghi chú từ Sale</h3>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    {selectedDeposit.notes}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedDeposit(null)}
                  className="btn-secondary flex-1"
                >
                  Đóng
                </button>
                {selectedDeposit.status === 'pending' && (
                  <>
                    <button className="btn-error flex-1">
                      <X className="w-4 h-4 mr-2" />
                      Từ chối
                    </button>
                    <button className="btn-success flex-1">
                      <Check className="w-4 h-4 mr-2" />
                      Duyệt
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
