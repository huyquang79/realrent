import { useState } from 'react';
import { Plus, Search, MapPin, Building2, MoreVertical, Edit, Trash } from 'lucide-react';
import { sampleBuildings, sampleRooms } from '../../lib/sample-data';
import { formatCurrency } from '../../lib/constants';
import { Sidebar } from '../../components/layout/Sidebar';
import { Modal } from '../../components/ui/Modal';

export function BuildingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredBuildings = sampleBuildings.filter((building) =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    building.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý tòa nhà</h1>
              <p className="text-sm text-gray-500 mt-1">
                {sampleBuildings.length} tòa nhà
              </p>
            </div>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Thêm tòa nhà
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Tìm tòa nhà theo tên hoặc khu vực..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Building Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuildings.map((building) => {
              const buildingRooms = sampleRooms.filter((r) => r.building_id === building.id);
              const availableRooms = buildingRooms.filter((r) => r.status === 'available').length;
              const totalRooms = building.total_rooms;

              return (
                <div key={building.id} className="card overflow-hidden">
                  {/* Building Image */}
                  <div className="relative aspect-video bg-gray-100">
                    {building.images?.[0] ? (
                      <img
                        src={building.images[0]}
                        alt={building.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-100">
                        <Building2 className="w-12 h-12 text-primary-600" />
                      </div>
                    )}
                    {/* Occupancy Badge */}
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                      {building.occupancy_rate}% lấp đầy
                    </div>
                  </div>

                  {/* Building Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{building.name}</h3>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{building.district}</span>
                    </div>

                    {/* Room Stats */}
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-success-50 rounded-lg">
                        <div className="text-lg font-bold text-success-600">{availableRooms}</div>
                        <div className="text-xs text-gray-500">Trống</div>
                      </div>
                      <div className="text-center p-2 bg-warning-50 rounded-lg">
                        <div className="text-lg font-bold text-warning-600">
                          {buildingRooms.filter((r) => r.status === 'deposited').length}
                        </div>
                        <div className="text-xs text-gray-500">Cọc</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-600">
                          {buildingRooms.filter((r) => r.status === 'rented').length}
                        </div>
                        <div className="text-xs text-gray-500">Thuê</div>
                      </div>
                    </div>

                    {/* Amenities */}
                    {building.amenities && building.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {building.amenities.slice(0, 3).map((amenity, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {amenity}
                          </span>
                        ))}
                        {building.amenities.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{building.amenities.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Building Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Thêm tòa nhà mới"
      >
        <form className="space-y-4">
          <div>
            <label className="label">Tên tòa nhà</label>
            <input type="text" className="input" placeholder="Tòa nhà ABC" />
          </div>
          <div>
            <label className="label">Địa chỉ</label>
            <input type="text" className="input" placeholder="Số nhà, đường, phường" />
          </div>
          <div>
            <label className="label">Quận/Huyện</label>
            <select className="input">
              <option value="">Chọn quận</option>
              <option value="Cầu Giấy">Cầu Giấy</option>
              <option value="Thanh Xuân">Thanh Xuân</option>
              <option value="Đống Đa">Đống Đa</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Số tầng</label>
              <input type="number" className="input" placeholder="6" />
            </div>
            <div>
              <label className="label">Tổng phòng</label>
              <input type="number" className="input" placeholder="30" />
            </div>
          </div>
          <div>
            <label className="label">Mô tả</label>
            <textarea className="input" rows={3} placeholder="Mô tả về tòa nhà..." />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">
              Hủy
            </button>
            <button type="submit" className="btn-primary flex-1">
              Thêm tòa nhà
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
