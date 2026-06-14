import { Link } from 'react-router-dom';
import { MapPin, Maximize2, Image, Star, UserCheck } from 'lucide-react';
import { formatCurrency, formatArea, ROOM_TYPE_LABELS } from '../../lib/constants';
import type { Database } from '../../lib/database.types';

type Room = Database['public']['Tables']['rooms']['Row'] & {
  building?: {
    name: string;
    district: string;
    address: string;
  };
};

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const image = room.images?.[0] || 'https://images.unsplash.com/photo-1522708323538-fba64bf76648?w=800';

  const statusConfig = {
    available: { label: 'Còn trống', className: 'badge-success' },
    deposited: { label: 'Đã cọc', className: 'badge-warning' },
    rented: { label: 'Đã thuê', className: 'badge-error' },
    maintenance: { label: 'Bảo trì', className: 'badge-gray' },
  };

  const status = statusConfig[room.status] || statusConfig.available;

  return (
    <Link
      to={`/room/${room.id}`}
      className="card-hover block overflow-hidden group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={`Phòng ${room.room_number}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={status.className}>{status.label}</span>
        </div>
        {/* Image Count */}
        {room.images && room.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
            <Image className="w-3 h-3" />
            {room.images.length}
          </div>
        )}
        {/* Quick Info Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xl font-bold text-primary-600">
            {formatCurrency(room.price)}/tháng
          </span>
          <span className="text-xs text-gray-400">
            {room.available_date && (
              <span>Phòng trống</span>
            )}
          </span>
        </div>

        {/* Area & Type */}
        <div className="flex items-center gap-3 mb-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Maximize2 className="w-4 h-4" />
            <span>{formatArea(room.area)}</span>
          </div>
          <span className="text-gray-300">|</span>
          <span>{ROOM_TYPE_LABELS[room.room_type] || room.room_type}</span>
        </div>

        {/* Location */}
        {room.building && (
          <div className="flex items-start gap-1 text-sm text-gray-500">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-medium text-gray-700">{room.building.district}</span>
              <span className="text-gray-400"> - {room.building.name}</span>
            </div>
          </div>
        )}

        {/* Amenities Preview */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {room.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-xs text-gray-400 px-1">
                +{room.amenities.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export function RoomCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] skeleton" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        <div className="skeleton h-7 w-32" />
        <div className="flex gap-3">
          <div className="skeleton h-4 w-16" />
          <div className="skeleton h-4 w-20" />
        </div>
        <div className="skeleton h-4 w-48" />
        <div className="flex gap-1">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-14 rounded-full" />
          <div className="skeleton h-5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function RoomCardFeatured({ room }: RoomCardProps) {
  const image = room.images?.[0] || 'https://images.unsplash.com/photo-1522708323538-fba64bf76648?w=800';

  return (
    <Link
      to={`/room/${room.id}`}
      className="card-hover block overflow-hidden group relative col-span-full lg:col-span-2 row-span-2"
    >
      {/* Large Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={`Phòng ${room.room_number}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Featured Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="badge bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            Nổi bật
          </span>
        </div>
        {/* Status Badge */}
        <div className="absolute top-3 left-24">
          <span className={`badge ${room.status === 'available' ? 'badge-success' : room.status === 'deposited' ? 'badge-warning' : 'badge-error'}`}>
            {room.status === 'available' ? 'Còn trống' : room.status === 'deposited' ? 'Đã cọc' : 'Đã thuê'}
          </span>
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="text-3xl font-bold mb-2">
            {formatCurrency(room.price)}/tháng
          </div>
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-200">
            <div className="flex items-center gap-1">
              <Maximize2 className="w-4 h-4" />
              <span>{formatArea(room.area)}</span>
            </div>
            <span>{ROOM_TYPE_LABELS[room.room_type] || room.room_type}</span>
            {room.building && (
              <>
                <span className="text-gray-400">|</span>
                <span>{room.building.district}</span>
              </>
            )}
          </div>
          {room.building && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <MapPin className="w-4 h-4" />
              <span>{room.building.name}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

interface SaleAgentCardProps {
  sale: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    successful_deals: number;
    response_rate: number;
    phone: string;
    rank: string;
  };
  onBookAppointment?: () => void;
}

export function SaleAgentCard({ sale, onBookAppointment }: SaleAgentCardProps) {
  const rankColors: Record<string, string> = {
    ctv: 'bg-gray-100 text-gray-700',
    bronze: 'bg-amber-100 text-amber-700',
    silver: 'bg-slate-100 text-slate-700',
    gold: 'bg-yellow-100 text-yellow-700',
    platinum: 'bg-cyan-100 text-cyan-700',
    diamond: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="card p-4">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          {sale.avatar ? (
            <img src={sale.avatar} alt={sale.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 text-lg font-bold">
              {sale.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900 truncate">{sale.name}</h4>
            <span className={`badge text-xs ${rankColors[sale.rank] || 'bg-gray-100 text-gray-700'}`}>
              {sale.rank}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span>{sale.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-success-500" />
              <span>{sale.successful_deals} giao dịch</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Phản hồi {sale.response_rate}% trong 24h
          </p>
        </div>
      </div>
      <button
        onClick={onBookAppointment}
        className="btn-outline w-full mt-3"
      >
        Đặt lịch xem phòng
      </button>
    </div>
  );
}
