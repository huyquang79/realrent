import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Maximize2,
  Layers,
  Calendar,
  Zap,
  Droplets,
  Wifi,
  Car,
  Camera,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Heart,
  Share2,
  UserCheck,
  Star,
  Check,
  X,
  Building2,
  DoorOpen,
} from 'lucide-react';
import { RoomCard } from '../components/room/RoomCard';
import { SaleAgentCard } from '../components/room/RoomCard';
import { sampleRooms, sampleSales } from '../lib/sample-data';
import {
  formatCurrency,
  formatArea,
  ROOM_TYPE_LABELS,
  AMENITY_LABELS,
} from '../lib/constants';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../lib/auth-context';

type AmenityKeys = 'ac' | 'bed' | 'wardrobe' | 'fridge' | 'washer_private' | 'washer_shared' |
                  'kitchen_private' | 'kitchen_shared' | 'balcony' | 'window' | 'parking' |
                  'elevator' | 'security_camera' | 'fingerprint_lock' | 'pet_allowed';

export function RoomDetailPage() {
  const { id } = useParams();
  const { user, profile } = useAuth();

  const [room, setRoom] = useState(sampleRooms.find((r) => r.id === id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (room) {
      document.title = `Phòng ${room.room_number} - ${room.building?.name || 'RentalFlow'}`;
    }
  }, [room]);

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Không tìm thấy phòng
          </h2>
          <Link to="/marketplace" className="btn-primary">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const relatedRooms = sampleRooms.filter(
    (r) =>
      r.id !== room.id &&
      r.building?.district === room.building?.district &&
      r.status === 'available'
  ).slice(0, 4);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      room.images ? (prev + 1) % room.images.length : prev
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      room.images ? (prev - 1 + room.images.length) % room.images.length : prev
    );
  };

  const utilityItems = [
    { icon: Zap, label: 'Điện', value: `${room.electricity_price?.toLocaleString() || 0}đ/kWh` },
    { icon: Droplets, label: 'Nước', value: `${room.water_price?.toLocaleString() || 0}đ` },
    { icon: Wifi, label: 'Internet', value: `${(room.internet_price?.toLocaleString() || 0)}đ` },
  ];

  const statusStyles = {
    available: 'bg-success-100 text-success-700 border-success-200',
    deposited: 'bg-warning-100 text-warning-700 border-warning-200',
    rented: 'bg-error-100 text-error-700 border-error-200',
    maintenance: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const handleBookAppointment = () => {
    if (!user) {
      // Redirect to auth
      window.location.href = '/auth?mode=register&auth=true';
      return;
    }
    setShowBookingModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
            <span>/</span>
            <Link to="/marketplace" className="hover:text-primary-600">Phòng trọ</Link>
            <span>/</span>
            <span className="text-gray-900">{room.room_number}</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Main Image */}
            <div className="lg:col-span-3 relative group">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                {room.images && room.images.length > 0 ? (
                  <img
                    src={room.images[currentImageIndex]}
                    alt={`Phòng ${room.room_number}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Image Navigation */}
              {room.images && room.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {room.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Full Screen Button */}
              <button
                onClick={() => setIsImageGalleryOpen(true)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/90 shadow hover:bg-white transition-colors"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnail Grid */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {room.images?.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? 'border-primary-500 shadow-md'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Details - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Phòng {room.room_number}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      statusStyles[room.status]
                    }`}>
                      {room.status === 'available' ? 'Còn trống' :
                       room.status === 'deposited' ? 'Đã cọc' :
                       room.status === 'rented' ? 'Đã thuê' : 'Bảo trì'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl font-bold text-primary-600">
                      {formatCurrency(room.price)}<span className="text-lg font-normal">/tháng</span>
                    </div>
                    {room.deposit_amount && (
                      <span className="text-sm text-gray-500">
                        Cọc: {formatCurrency(room.deposit_amount)}
                      </span>
                    )}
                  </div>
                  {room.building && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{room.building.address}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`p-2 rounded-lg border transition-colors ${
                      isSaved
                        ? 'bg-error-50 border-error-200 text-error-600'
                        : 'border-gray-200 text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:border-gray-300 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="card p-4 text-center">
                <Maximize2 className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <div className="text-xl font-semibold text-gray-900">{formatArea(room.area)}</div>
                <div className="text-sm text-gray-500">Diện tích</div>
              </div>
              <div className="card p-4 text-center">
                <Layers className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <div className="text-xl font-semibold text-gray-900">{ROOM_TYPE_LABELS[room.room_type] || room.room_type}</div>
                <div className="text-sm text-gray-500">Loại phòng</div>
              </div>
              <div className="card p-4 text-center">
                <Building2 className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <div className="text-xl font-semibold text-gray-900">{room.floor || 1}</div>
                <div className="text-sm text-gray-500">Tầng</div>
              </div>
              <div className="card p-4 text-center">
                <DoorOpen className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <div className="text-xl font-semibold text-gray-900">{room.room_number}</div>
                <div className="text-sm text-gray-500">Số phòng</div>
              </div>
            </div>

            {/* Utilities */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tiện ích hàng tháng</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {utilityItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">{item.label}</div>
                        <div className="font-medium text-gray-900">{item.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Amenities */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tiện nghi</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {room.amenities?.map((amenity) => {
                  const label = AMENITY_LABELS[amenity as AmenityKeys] || amenity;
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 p-3 bg-success-50 rounded-lg"
                    >
                      <Check className="w-4 h-4 text-success-600" />
                      <span className="text-sm text-gray-700">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Mô tả</h2>
              <p className="text-gray-600 leading-relaxed">
                {room.description || 'Chưa có mô tả chi tiết cho phòng này.'}
              </p>
            </div>

            {/* Building Info */}
            {room.building && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Thông tin tòa nhà
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">Tên tòa nhà:</span>
                        <span className="ml-2 font-medium text-gray-900">{room.building.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">Địa chỉ:</span>
                        <span className="ml-2 text-gray-900">{room.building.address}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">Tổng tầng:</span>
                        <span className="ml-2 font-medium text-gray-900">{room.building.total_floors || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Building Amenities */}
                {room.building.amenities && room.building.amenities.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Tiện ích tòa nhà:</p>
                    <div className="flex flex-wrap gap-2">
                      {room.building.amenities.map((amenity, index) => (
                        <span key={index} className="badge-gray">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Booking Card */}
            <div className="card p-6 sticky top-24">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">
                    {formatCurrency(room.price)}
                  </div>
                  <div className="text-sm text-gray-500">/tháng</div>
                </div>

                <div className="py-4 border-t border-b border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Diện tích</span>
                      <div className="font-medium text-gray-900">{formatArea(room.area)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Loại</span>
                      <div className="font-medium text-gray-900">{ROOM_TYPE_LABELS[room.room_type]}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleBookAppointment}
                    disabled={room.status !== 'available'}
                    className="btn-primary w-full"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Đặt lịch xem phòng
                  </button>

                  <button className="btn-secondary w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Liên hệ
                  </button>

                  <button className="btn-ghost w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat ngay
                  </button>
                </div>
              </div>
            </div>

            {/* Sales Agents */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Nhân viên hỗ trợ</h3>
              <div className="space-y-4">
                {sampleSales.slice(0, 2).map((sale) => (
                  <SaleAgentCard
                    key={sale.id}
                    sale={sale}
                    onBookAppointment={handleBookAppointment}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Rooms */}
        {relatedRooms.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Phòng tương tự tại {room.building?.district}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedRooms.map((r) => (
                <RoomCard key={r.id} room={r} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Gallery Modal */}
      <Modal
        isOpen={isImageGalleryOpen}
        onClose={() => setIsImageGalleryOpen(false)}
        size="full"
        showClose={true}
      >
        <div className="relative h-[80vh] bg-black rounded-lg overflow-hidden">
          {room.images && room.images.length > 0 && (
            <>
              <img
                src={room.images[currentImageIndex]}
                alt=""
                className="w-full h-full object-contain"
              />
              {room.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 shadow hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 shadow hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                {currentImageIndex + 1} / {room.images.length}
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Đặt lịch xem phòng"
        description={`Phòng ${room.room_number} - ${room.building?.name}`}
      >
        <form className="space-y-4">
          <div>
            <label className="label">Họ tên</label>
            <input type="text" className="input" defaultValue={profile?.full_name || ''} />
          </div>
          <div>
            <label className="label">Số điện thoại</label>
            <input type="tel" className="input" defaultValue={profile?.phone || ''} />
          </div>
          <div>
            <label className="label">Chọn ngày xem phòng</label>
            <input type="date" className="input" />
          </div>
          <div>
            <label className="label">Giờ xem phòng</label>
            <select className="input">
              <option value="morning">Buổi sáng (8:00 - 12:00)</option>
              <option value="afternoon">Buổi chiều (14:00 - 18:00)</option>
              <option value="evening">Buổi tối (18:00 - 21:00)</option>
            </select>
          </div>
          <div>
            <label className="label">Ghi chú</label>
            <textarea className="input" rows={3} placeholder="Ghi chú thêm..." />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowBookingModal(false)}
              className="btn-secondary flex-1"
            >
              Hủy
            </button>
            <button type="submit" className="btn-primary flex-1">
              Gửi yêu cầu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
