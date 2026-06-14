import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Grid, List, Building2, Sparkles, MapPin } from 'lucide-react';
import { RoomCard, RoomCardSkeleton, RoomCardFeatured } from '../components/room/RoomCard';
import { FilterPanel, MobileFilterDrawer } from '../components/room/FilterPanel';
import { sampleRooms } from '../lib/sample-data';
import { useAuth } from '../lib/auth-context';
import type { Database } from '../lib/database.types';

type Room = Database['public']['Tables']['rooms']['Row'] & {
  building?: {
    name: string;
    district: string;
    address: string;
  };
};

interface FilterState {
  districts: string[];
  priceRange: string | null;
  areaRange: string | null;
  amenities: string[];
  roomType: string | null;
}

const initialFilters: FilterState = {
  districts: [],
  priceRange: null,
  areaRange: null,
  amenities: [],
  roomType: null,
};

export function MarketplacePage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setRooms(sampleRooms as Room[]);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter rooms
  const filteredRooms = rooms.filter((room) => {
    // District filter
    if (filters.districts.length > 0 && room.building) {
      if (!filters.districts.includes(room.building.district)) return false;
    }

    // Price filter
    if (filters.priceRange) {
      const price = room.price;
      switch (filters.priceRange) {
        case 'under_3m':
          if (price >= 3000000) return false;
          break;
        case '3m_5m':
          if (price < 3000000 || price >= 5000000) return false;
          break;
        case '5m_7m':
          if (price < 5000000 || price >= 7000000) return false;
          break;
        case '7m_10m':
          if (price < 7000000 || price >= 10000000) return false;
          break;
        case 'over_10m':
          if (price < 10000000) return false;
          break;
      }
    }

    // Area filter
    if (filters.areaRange) {
      const area = room.area;
      switch (filters.areaRange) {
        case 'under_20':
          if (area >= 20) return false;
          break;
        case '20_30':
          if (area < 20 || area >= 30) return false;
          break;
        case '30_50':
          if (area < 30 || area >= 50) return false;
          break;
        case 'over_50':
          if (area < 50) return false;
          break;
      }
    }

    // Room type filter
    if (filters.roomType && room.room_type !== filters.roomType) {
      return false;
    }

    // Amenities filter
    if (filters.amenities.length > 0 && room.amenities) {
      const hasAllAmenities = filters.amenities.every((a) =>
        room.amenities?.includes(a)
      );
      if (!hasAllAmenities) return false;
    }

    // Only show available rooms
    if (room.status !== 'available' && room.status !== 'deposited') return false;

    return true;
  });

  // Sort rooms
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'area_large':
        return b.area - a.area;
      default:
        return 0;
    }
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Tìm phòng trọ hoàn hảo của bạn
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto">
              Khám phá hàng ngàn phòng trọ, chung cư mini trên toàn Hà Nội.
              Minh bạch, an toàn, tiết kiệm thời gian.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">{rooms.length}+</div>
              <div className="text-sm text-primary-200">Phòng trọ</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">15</div>
              <div className="text-sm text-primary-200">Quận</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-primary-200">Xác thực</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                resultCount={sortedRooms.length}
              />
            </div>
          </div>

          {/* Room List */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="btn-secondary lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Bộ lọc
                </button>
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{sortedRooms.length}</span> phòng phù hợp
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="input w-auto py-1.5"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_low">Giá thấp đến cao</option>
                  <option value="price_high">Giá cao đến thấp</option>
                  <option value="area_large">Diện tích lớn</option>
                </select>

                {/* View mode */}
                <div className="hidden sm:flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${
                      viewMode === 'grid'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${
                      viewMode === 'list'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Rooms */}
            {sortedRooms.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Phòng nổi bật</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                  {/* Featured room in first slot */}
                  <RoomCardFeatured room={sortedRooms[0]} />
                  {sortedRooms.slice(1, 4).map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
              </div>
            )}

            {/* All Rooms Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <RoomCardSkeleton key={i} />
                ))}
              </div>
            ) : sortedRooms.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không tìm thấy phòng
                </h3>
                <p className="text-gray-500 mb-4">
                  Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                </p>
                <button onClick={handleResetFilters} className="btn-primary">
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedRooms.slice(4).map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            )}

            {/* Load More */}
            {sortedRooms.length > 10 && (
              <div className="text-center mt-8">
                <button className="btn-secondary">
                  Xem thêm phòng
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popular Districts */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Khu vực phổ biến
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {['Cầu Giấy', 'Thanh Xuân', 'Đống Đa', 'Hà Đông', 'Long Biên'].map((district) => (
              <button
                key={district}
                onClick={() => {
                  setFilters({ ...filters, districts: [district] });
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors group"
              >
                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                <span className="font-medium text-gray-700 group-hover:text-primary-600">
                  {district}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        resultCount={sortedRooms.length}
      />
    </div>
  );
}
