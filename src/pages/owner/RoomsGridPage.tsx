import { useState } from 'react';
import {
  ChevronDown,
  Building2,
  LayoutGrid,
  Check,
  User,
  DoorOpen,
} from 'lucide-react';
import { sampleBuildings, sampleRooms } from '../../lib/sample-data';
import { formatCurrency, formatArea, ROOM_TYPE_LABELS } from '../../lib/constants';
import { Sidebar } from '../../components/layout/Sidebar';
import { Modal } from '../../components/ui/Modal';

export function RoomsGridPage() {
  const [selectedBuilding, setSelectedBuilding] = useState(sampleBuildings[0]);
  const [selectedRoom, setSelectedRoom] = useState<typeof sampleRooms[0] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const buildingRooms = sampleRooms.filter((r) => r.building_id === selectedBuilding?.id);
  const floors = [...new Set(buildingRooms.map((r) => r.floor))].sort((a, b) => a - b);

  const getRoomsByFloor = (floor: number) =>
    buildingRooms.filter((r) => r.floor === floor);

  const statusStyles = {
    available: 'room-available',
    deposited: 'room-deposited',
    rented: 'room-rented',
    maintenance: 'room-grid-item bg-gray-100 border-gray-200 text-gray-500 hover:border-gray-400',
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý phòng</h1>
              <p className="text-sm text-gray-500 mt-1">
                Xem nhanh trạng thái tất cả phòng
              </p>
            </div>

            {/* Building Selector */}
            <div className="relative">
              <select
                value={selectedBuilding?.id}
                onChange={(e) => {
                  const building = sampleBuildings.find((b) => b.id === e.target.value);
                  setSelectedBuilding(building || null);
                }}
                className="input w-auto pr-10"
              >
                {sampleBuildings.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success-100 border-2 border-success-200" />
              <span className="text-gray-600">Còn trống</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-warning-100 border-2 border-warning-200" />
              <span className="text-gray-600">Đã cọc</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-error-100 border-2 border-error-200" />
              <span className="text-gray-600">Đã thuê</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-100 border-2 border-gray-200" />
              <span className="text-gray-600">Bảo trì</span>
            </div>
          </div>
        </div>

        {/* Room Grid */}
        <div className="p-6">
          <div className="space-y-8">
            {floors.map((floor) => (
              <div key={floor} className="card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600">{floor}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Tầng {floor}</h3>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {getRoomsByFloor(floor).map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={statusStyles[room.status]}
                    >
                      {room.room_number}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          {selectedBuilding && (
            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{buildingRooms.length}</div>
                <div className="text-sm text-gray-500">Tổng phòng</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-success-600">
                  {buildingRooms.filter((r) => r.status === 'available').length}
                </div>
                <div className="text-sm text-gray-500">Còn trống</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-warning-600">
                  {buildingRooms.filter((r) => r.status === 'deposited').length}
                </div>
                <div className="text-sm text-gray-500">Đã cọc</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-error-600">
                  {buildingRooms.filter((r) => r.status === 'rented').length}
                </div>
                <div className="text-sm text-gray-500">Đã thuê</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Room Detail Drawer */}
      {selectedRoom && (
        <Modal
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
          title={`Phòng ${selectedRoom.room_number}`}
        >
          <div className="space-y-4">
            {/* Status Badge */}
            <div>
              <span
                className={`badge ${
                  selectedRoom.status === 'available'
                    ? 'badge-success'
                    : selectedRoom.status === 'deposited'
                    ? 'badge-warning'
                    : 'badge-error'
                }`}
              >
                {selectedRoom.status === 'available'
                  ? 'Còn trống'
                  : selectedRoom.status === 'deposited'
                  ? 'Đã cọc'
                  : selectedRoom.status === 'rented'
                  ? 'Đã thuê'
                  : 'Bảo trì'}
              </span>
            </div>

            {/* Price */}
            <div className="p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">
                {formatCurrency(selectedRoom.price)}<span className="text-sm font-normal">/tháng</span>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Diện tích</span>
                <div className="font-medium text-gray-900">{formatArea(selectedRoom.area)}</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Loại phòng</span>
                <div className="font-medium text-gray-900">{ROOM_TYPE_LABELS[selectedRoom.room_type]}</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Tầng</span>
                <div className="font-medium text-gray-900">{selectedRoom.floor}</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Tiền cọc</span>
                <div className="font-medium text-gray-900">{formatCurrency(selectedRoom.deposit_amount || 0)}</div>
              </div>
            </div>

            {/* Amenities */}
            {selectedRoom.amenities && selectedRoom.amenities.length > 0 && (
              <div>
                <span className="text-sm text-gray-500">Tiện nghi</span>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedRoom.amenities.map((amenity, i) => (
                    <span key={i} className="badge-gray">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {selectedRoom.description && (
              <div>
                <span className="text-sm text-gray-500">Mô tả</span>
                <p className="text-gray-700 mt-1">{selectedRoom.description}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <button className="btn-secondary flex-1">
                <Edit className="w-4 h-4 mr-2" />
                Sửa
              </button>
              {selectedRoom.status === 'available' && (
                <button className="btn-primary flex-1">
                  <User className="w-4 h-4 mr-2" />
                  Cho thuê
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
