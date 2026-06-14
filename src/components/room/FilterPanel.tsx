import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X, ChevronLeft } from 'lucide-react';
import {
  HANOI_DISTRICTS,
  PRICE_RANGES,
  AREA_RANGES,
  AMENITIES,
  ROOM_TYPES,
} from '../../lib/constants';

interface FilterState {
  districts: string[];
  priceRange: string | null;
  areaRange: string | null;
  amenities: string[];
  roomType: string | null;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  resultCount?: number;
}

export function FilterPanel({ filters, onFilterChange, onReset, resultCount }: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    price: true,
    area: true,
    roomType: false,
    amenities: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleDistrictToggle = (district: string) => {
    const newDistricts = filters.districts.includes(district)
      ? filters.districts.filter((d) => d !== district)
      : [...filters.districts, district];
    onFilterChange({ ...filters, districts: newDistricts });
  };

  const handlePriceRangeSelect = (range: string) => {
    onFilterChange({
      ...filters,
      priceRange: filters.priceRange === range ? null : range,
    });
  };

  const handleAreaRangeSelect = (range: string) => {
    onFilterChange({
      ...filters,
      areaRange: filters.areaRange === range ? null : range,
    });
  };

  const handleRoomTypeSelect = (type: string) => {
    onFilterChange({
      ...filters,
      roomType: filters.roomType === type ? null : type,
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onFilterChange({ ...filters, amenities: newAmenities });
  };

  const hasActiveFilters =
    filters.districts.length > 0 ||
    filters.priceRange !== null ||
    filters.areaRange !== null ||
    filters.amenities.length > 0 ||
    filters.roomType !== null;

  const activeFilterCount =
    filters.districts.length +
    (filters.priceRange ? 1 : 0) +
    (filters.areaRange ? 1 : 0) +
    filters.amenities.length +
    (filters.roomType ? 1 : 0);

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">Bộ lọc</span>
          {activeFilterCount > 0 && (
            <span className="badge-primary">{activeFilterCount}</span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Đặt lại
          </button>
        )}
      </div>

      {/* Result Count */}
      {resultCount !== undefined && (
        <div className="px-4 py-2 border-b border-gray-200 bg-primary-50">
          <span className="text-sm text-gray-600">
            <span className="font-semibold text-primary-600">{resultCount}</span> phòng tìm thấy
          </span>
        </div>
      )}

      {/* Filter Sections */}
      <div className="divide-y divide-gray-200">
        {/* Location */}
        <div>
          <button
            onClick={() => toggleSection('location')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Khu vực</span>
            {expandedSections.location ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {expandedSections.location && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                {HANOI_DISTRICTS.map((district) => (
                  <button
                    key={district}
                    onClick={() => handleDistrictToggle(district)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      filters.districts.includes(district)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {district}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price Range */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Giá thuê</span>
            {expandedSections.price ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {expandedSections.price && (
            <div className="px-4 pb-4">
              <div className="space-y-2">
                {PRICE_RANGES.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => handlePriceRangeSelect(range.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      filters.priceRange === range.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Area Range */}
        <div>
          <button
            onClick={() => toggleSection('area')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Diện tích</span>
            {expandedSections.area ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {expandedSections.area && (
            <div className="px-4 pb-4">
              <div className="space-y-2">
                {AREA_RANGES.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => handleAreaRangeSelect(range.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      filters.areaRange === range.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Room Type */}
        <div>
          <button
            onClick={() => toggleSection('roomType')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Loại phòng</span>
            {expandedSections.roomType ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {expandedSections.roomType && (
            <div className="px-4 pb-4">
              <div className="space-y-2">
                {ROOM_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleRoomTypeSelect(type.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      filters.roomType === type.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Amenities */}
        <div>
          <button
            onClick={() => toggleSection('amenities')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Tiện nghi</span>
            {expandedSections.amenities ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {expandedSections.amenities && (
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES.map((amenity) => (
                  <button
                    key={amenity.value}
                    onClick={() => handleAmenityToggle(amenity.value)}
                    className={`text-left px-3 py-2 rounded-lg text-xs transition-all ${
                      filters.amenities.includes(amenity.value)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {amenity.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  resultCount,
}: FilterPanelProps & { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-1">
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <span className="font-semibold text-gray-900 text-lg">Bộ lọc</span>
          </div>
          {resultCount !== undefined && (
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-primary-600">{resultCount}</span> phòng
            </span>
          )}
        </div>

        {/* Filter Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          <FilterPanel
            filters={filters}
            onFilterChange={onFilterChange}
            onReset={onReset}
          />
        </div>

        {/* Apply Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <button
              onClick={onReset}
              className="btn-secondary flex-1"
            >
              Đặt lại
            </button>
            <button
              onClick={onClose}
              className="btn-primary flex-1"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
