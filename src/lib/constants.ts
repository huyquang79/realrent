export const HANOI_DISTRICTS = [
  'Ba Đình',
  'Hoàn Kiếm',
  'Hai Bà Trưng',
  'Đống Đa',
  'Cầu Giấy',
  'Thanh Xuân',
  'Nam Từ Liêm',
  'Bắc Từ Liêm',
  'Hà Đông',
  'Long Biên',
  'Tây Hồ',
  'Hoàng Mai',
  'Gia Lâm',
  'Đông Anh',
  'Hoài Đức',
] as const;

export const PRICE_RANGES = [
  { value: 'under_3m', label: 'Dưới 3 triệu' },
  { value: '3m_5m', label: '3 - 5 triệu' },
  { value: '5m_7m', label: '5 - 7 triệu' },
  { value: '7m_10m', label: '7 - 10 triệu' },
  { value: 'over_10m', label: 'Trên 10 triệu' },
] as const;

export const AREA_RANGES = [
  { value: 'under_20', label: 'Dưới 20m²' },
  { value: '20_30', label: '20 - 30m²' },
  { value: '30_50', label: '30 - 50m²' },
  { value: 'over_50', label: 'Trên 50m²' },
] as const;

export const AMENITIES = [
  { value: 'washer_private', label: 'Máy giặt riêng' },
  { value: 'washer_shared', label: 'Máy giặt chung' },
  { value: 'ac', label: 'Điều hòa' },
  { value: 'bed', label: 'Giường' },
  { value: 'wardrobe', label: 'Tủ quần áo' },
  { value: 'fridge', label: 'Tủ lạnh' },
  { value: 'kitchen_private', label: 'Bếp riêng' },
  { value: 'kitchen_shared', label: 'Bếp chung' },
  { value: 'balcony', label: 'Ban công' },
  { value: 'window', label: 'Cửa sổ' },
  { value: 'parking', label: 'Chỗ để xe' },
  { value: 'elevator', label: 'Thang máy' },
  { value: 'security_camera', label: 'Camera an ninh' },
  { value: 'fingerprint_lock', label: 'Khóa vân tay' },
  { value: 'pet_allowed', label: 'Cho nuôi thú cưng' },
] as const;

export const ROOM_TYPES = [
  { value: 'chung_cu_mini', label: 'Chung cư mini' },
  { value: 'studio', label: 'Studio' },
  { value: '1n1k', label: '1N1K (1 Ngủ 1 Khách)' },
  { value: '2n1k', label: '2N1K (2 Ngủ 1 Khách)' },
  { value: 'ccmn_cao_cap', label: 'CCMN cao cấp' },
  { value: 'can_ho_dich_vu', label: 'Căn hộ dịch vụ' },
] as const;

export const ROOM_STATUS = [
  { value: 'available', label: 'Còn trống', color: 'success' },
  { value: 'deposited', label: 'Đã cọc', color: 'warning' },
  { value: 'rented', label: 'Đã thuê', color: 'error' },
  { value: 'maintenance', label: 'Bảo trì', color: 'gray' },
] as const;

export const LEAD_STATUS = [
  { value: 'new', label: 'Lead mới', color: 'primary' },
  { value: 'consulting', label: 'Đang tư vấn', color: 'gray' },
  { value: 'scheduled', label: 'Đã đặt lịch', color: 'warning' },
  { value: 'viewed', label: 'Đã xem phòng', color: 'primary' },
  { value: 'deposited', label: 'Đã cọc', color: 'warning' },
  { value: 'success', label: 'Thành công', color: 'success' },
  { value: 'cancelled', label: 'Hủy', color: 'error' },
] as const;

export const SALE_RANKS = [
  { value: 'ctv', label: 'Cộng tác viên', color: 'gray' },
  { value: 'bronze', label: 'Bronze', color: 'amber' },
  { value: 'silver', label: 'Silver', color: 'slate' },
  { value: 'gold', label: 'Gold', color: 'yellow' },
  { value: 'platinum', label: 'Platinum', color: 'cyan' },
  { value: 'diamond', label: 'Diamond', color: 'blue' },
] as const;

export const SALE_RANK_ICONS: Record<string, string> = {
  ctv: '👥',
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
  diamond: '👑',
};

export const KYC_STATUS = [
  { value: 'pending', label: 'Chưa xác thực' },
  { value: 'submitted', label: 'Đã gửi' },
  { value: 'approved', label: 'Đã xác thực' },
  { value: 'rejected', label: 'Từ chối' },
] as const;

export const DEPOSIT_STATUS = [
  { value: 'pending', label: 'Chờ duyệt', color: 'warning' },
  { value: 'approved', label: 'Đã duyệt', color: 'success' },
  { value: 'rejected', label: 'Từ chối', color: 'error' },
  { value: 'cancelled', label: 'Đã hủy', color: 'gray' },
  { value: 'refunded', label: 'Đã hoàn', color: 'gray' },
] as const;

export const COMMISSION_STATUS = [
  { value: 'pending', label: 'Chờ duyệt', color: 'warning' },
  { value: 'approved', label: 'Đã duyệt', color: 'primary' },
  { value: 'paid', label: 'Đã thanh toán', color: 'success' },
] as const;

export const APPOINTMENT_STATUS = [
  { value: 'scheduled', label: 'Đã lên lịch' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'checked_in', label: 'Đã check-in' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
  { value: 'no_show', label: 'Không đến' },
] as const;

export const DISPUTE_PRIORITY = [
  { value: 'low', label: 'Thấp', color: 'gray' },
  { value: 'normal', label: 'Bình thường', color: 'primary' },
  { value: 'high', label: 'Cao', color: 'warning' },
  { value: 'urgent', label: 'Khẩn cấp', color: 'error' },
] as const;

export const DISPUTE_STATUS = [
  { value: 'open', label: 'Mở', color: 'primary' },
  { value: 'investigating', label: 'Đang xử lý', color: 'warning' },
  { value: 'resolved', label: 'Đã giải quyết', color: 'success' },
  { value: 'closed', label: 'Đóng', color: 'gray' },
  { value: 'escalated', label: 'Nâng cấp', color: 'error' },
] as const;

export const AMENITY_LABELS: Record<string, string> = {
  washer_private: 'Máy giặt riêng',
  washer_shared: 'Máy giặt chung',
  ac: 'Điều hòa',
  bed: 'Giường',
  wardrobe: 'Tủ quần áo',
  fridge: 'Tủ lạnh',
  kitchen_private: 'Bếp riêng',
  kitchen_shared: 'Bếp chung',
  balcony: 'Ban công',
  window: 'Cửa sổ',
  parking: 'Chỗ để xe',
  elevator: 'Thang máy',
  security_camera: 'Camera an ninh',
  fingerprint_lock: 'Khóa vân tay',
  pet_allowed: 'Cho nuôi thú cưng',
};

export const ROOM_TYPE_LABELS: Record<string, string> = {
  chung_cu_mini: 'Chung cư mini',
  studio: 'Studio',
  '1n1k': '1N1K (1 Ngủ 1 Khách)',
  '2n1k': '2N1K (2 Ngủ 1 Khách)',
  ccmn_cao_cap: 'CCMN cao cấp',
  can_ho_dich_vu: 'Căn hộ dịch vụ',
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatArea(area: number): string {
  return `${area}m²`;
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  if (weeks < 4) return `${weeks} tuần trước`;
  return `${months} tháng trước`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    available: 'success',
    deposited: 'warning',
    rented: 'error',
    maintenance: 'gray',
  };
  return colors[status] || 'gray';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    available: 'Còn trống',
    deposited: 'Đã cọc',
    rented: 'Đã thuê',
    maintenance: 'Bảo trì',
  };
  return labels[status] || status;
}
