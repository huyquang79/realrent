import { useState } from 'react';
import {
  Award,
  TrendingUp,
  Trophy,
  Target,
  Users,
  DollarSign,
  ChevronUp,
  ChevronDown,
  Star,
  Medal,
  Crown,
  Zap,
} from 'lucide-react';
import { formatCurrency, SALE_RANKS, SALE_RANK_ICONS } from '../../lib/constants';
import { Sidebar } from '../../components/layout/Sidebar';

export function RankingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentRank = 'gold';
  const currentPoints = 1250;
  const nextRank = 'platinum';
  const pointsToNextRank = 250;

  const leaderboard = [
    { rank: 'platinum', points: 1500, deals: 45, commissions: 45000000 },
    { rank: 'gold', points: 1250, deals: 38, commissions: 38000000 },
    { rank: 'gold', points: 1100, deals: 35, commissions: 35000000 },
  ];

  const rankConfigs = {
    ctv: {
      color: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: Users,
      requirements: ['Chưa có giao dịch', 'Đăng ký để bắt đầu'],
      benefits: ['Hoa hồng 10%', 'Hỗ trợ cơ bản'],
    },
    bronze: {
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: Medal,
      requirements: ['2 giao dịch/tháng', 'Điểm từ 100'],
      benefits: ['Hoa hồng 12%', 'Ưu tiên nhận lead'],
    },
    silver: {
      color: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Medal,
      requirements: ['5 giao dịch/tháng', 'Điểm từ 500'],
      benefits: ['Hoa hồng 13%', 'Báo cáo chi tiết'],
    },
    gold: {
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: Trophy,
      requirements: ['10 giao dịch/tháng', 'Điểm từ 1000'],
      benefits: ['Hoa hồng 15%', 'Badge vàng', 'Dự án độc quyền'],
    },
    platinum: {
      color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      icon: Star,
      requirements: ['20 giao dịch/tháng', 'Điểm từ 1500'],
      benefits: ['Hoa hồng 16%', 'Badge platinum', 'Lead HOT'],
    },
    diamond: {
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: Crown,
      requirements: ['40 giao dịch/tháng', 'Điểm từ 2500'],
      benefits: ['Hoa hồng 18%', 'Tài khoản VIP', 'Hỗ trợ 24/7'],
    },
  };

  const currentConfig = rankConfigs[currentRank];
  const nextConfig = rankConfigs[nextRank];
  const Icon = currentConfig.icon;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Xếp hạng Sale</h1>
            <p className="text-primary-100">
              Thực hiện giao dịch để tăng xếp hạng và nhận quyền lợi
            </p>
          </div>
        </div>

        {/* Current Rank */}
        <div className="max-w-4xl mx-auto px-6 -mt-8">
          <div className="card p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Rank Badge */}
              <div
                className={`w-24 h-24 rounded-2xl border-2 flex items-center justify-center ${
                  currentConfig.color
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl">{SALE_RANK_ICONS[currentRank]}</div>
                  <div className="text-sm font-semibold mt-1">
                    {SALE_RANKS.find((r) => r.value === currentRank)?.label}
                  </div>
                </div>
              </div>

              {/* Rank Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-bold text-gray-900">
                  Hạng hiện tại: {SALE_RANKS.find((r) => r.value === currentRank)?.label}
                </h2>
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-500">Điểm hiện tại</span>
                    <span className="text-lg font-bold text-primary-600">{currentPoints}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600 rounded-full transition-all"
                      style={{ width: `${(currentPoints / 1500) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Cần thêm {pointsToNextRank} điểm để lên {SALE_RANKS.find((r) => r.value === nextRank)?.label}
                  </p>
                </div>
              </div>

              {/* Points */}
              <div className="flex flex-col items-center gap-2">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-success-600">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-2xl font-bold">85%</span>
                  </div>
                  <span className="text-sm text-gray-500">KPI tháng này</span>
                </div>
              </div>
            </div>

            {/* Progress to Next Rank */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Thăng hạng</h3>
                <div className="flex items-center gap-1 text-success-600">
                  <ChevronUp className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Còn {pointsToNextRank} điểm
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center ${
                  currentConfig.color
                }`}>
                  {SALE_RANK_ICONS[currentRank]}
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
                  <div
                    className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
                    style={{ width: `${(currentPoints / 1500) * 100}%` }}
                  />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      nextConfig.color
                    } flex items-center justify-center bg-white`}>
                      {SALE_RANK_ICONS[nextRank]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="max-w-4xl mx-auto px-6 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="stat-card">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <Trophy className="w-5 h-5" />
                <span className="text-sm">Giao dịch thành công</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">45</div>
            </div>
            <div className="stat-card">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <Users className="w-5 h-5" />
                <span className="text-sm">Tổng Leads</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">156</div>
            </div>
            <div className="stat-card">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <Target className="w-5 h-5" />
                <span className="text-sm">Tỷ lệ chốt</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">28%</div>
            </div>
            <div className="stat-card">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm">Tổng hoa hồng</span>
              </div>
              <div className="text-xl font-bold text-success-600">
                {formatCurrency(45000000)}
              </div>
            </div>
          </div>
        </div>

        {/* Rank Benefits */}
        <div className="max-w-4xl mx-auto px-6 mt-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quyền lợi hạng hiện tại</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Quyền lợi</h4>
                <ul className="space-y-2">
                  {currentConfig.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary-600" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Nâng cấp lên {SALE_RANKS.find((r) => r.value === nextRank)?.label}
                </h4>
                <ul className="space-y-2">
                  {nextConfig.requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-warning-600" />
                      <span className="text-gray-600">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto px-6 mt-6 pb-8">
          <div className="card">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Bảng xếp hạng</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {leaderboard.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-400">
                      {index + 1}
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      rankConfigs[player.rank].color
                    }`}>
                      {SALE_RANK_ICONS[player.rank]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Người dùng {index + 1}</p>
                      <p className="text-sm text-gray-500">{player.deals} giao dịch</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">{player.points} điểm</p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(player.commissions)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
