import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  User,
  Check,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { formatDateTime, formatDate } from '../../lib/constants';
import { sampleAppointments, sampleRooms } from '../../lib/sample-data';
import { Sidebar } from '../../components/layout/Sidebar';
import { Modal } from '../../components/ui/Modal';

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTHS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

export function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkInModal, setCheckInModal] = useState(false);

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const prevMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getDaysInMonth = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth();

  const getAppointmentsForDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return sampleAppointments.filter((apt) => {
      const aptDate = new Date(apt.scheduled_at);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lịch xem phòng</h1>
              <p className="text-sm text-gray-500 mt-1">
                Quản lý lịch hẹn với khách hàng
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('calendar')}
                className={`btn ${viewMode === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Lịch
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Danh sách
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {viewMode === 'calendar' ? (
            <div className="card">
              {/* Calendar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {MONTHS[currentMonth]} {currentYear}
                  </h2>
                  <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <button onClick={goToToday} className="btn-secondary btn-sm">
                  Hôm nay
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="p-4">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {WEEKDAYS.map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before the first of the month */}
                  {[...Array(startingDay)].map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square p-2" />
                  ))}

                  {/* Days of the month */}
                  {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const appointments = getAppointmentsForDate(day);
                    const isToday =
                      day === new Date().getDate() &&
                      currentMonth === new Date().getMonth() &&
                      currentYear === new Date().getFullYear();

                    return (
                      <div
                        key={day}
                        className={`aspect-square p-2 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                          isToday
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-transparent'
                        } ${appointments.length > 0 ? 'bg-gray-50' : ''}`}
                      >
                        <div className="flex items-center justify-center">
                          <span
                            className={`text-sm ${
                              isToday ? 'font-bold text-primary-600' : 'text-gray-900'
                            }`}
                          >
                            {day}
                          </span>
                        </div>
                        {appointments.length > 0 && (
                          <div className="flex justify-center mt-1">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                appointments[0].status === 'scheduled'
                                  ? 'bg-warning-100 text-warning-700'
                                  : appointments[0].status === 'completed'
                                  ? 'bg-success-100 text-success-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {appointments.length}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Day Appointments */}
              <div className="border-t border-gray-200 p-4">
                <h3 className="font-medium text-gray-900 mb-4">
                  Lịch hẹn ngày {formatDate(selectedDate)}
                </h3>
                <div className="space-y-3">
                  {sampleAppointments.slice(0, 3).map((apt) => {
                    const room = sampleRooms.find((r) => r.id === apt.room_id);
                    return (
                      <div
                        key={apt.id}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                          <Clock className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900">{apt.customer_name}</p>
                            <span
                              className={`badge ${
                                apt.status === 'scheduled'
                                  ? 'badge-warning'
                                  : apt.status === 'completed'
                                  ? 'badge-success'
                                  : 'badge-gray'
                              }`}
                            >
                              {apt.status === 'scheduled' ? 'Chờ' : apt.status === 'completed' ? 'Hoàn thành' : apt.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {formatDateTime(apt.scheduled_at)} - Phòng {room?.room_number}
                          </p>
                          {room?.building && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {room.building.address}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button className="btn-sm btn-secondary">
                            <Phone className="w-4 h-4" />
                          </button>
                          {apt.status === 'scheduled' && (
                            <button
                              onClick={() => setCheckInModal(true)}
                              className="btn-sm btn-primary"
                            >
                              Check-in
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {sampleAppointments.map((apt) => {
                const room = sampleRooms.find((r) => r.id === apt.room_id);
                return (
                  <div key={apt.id} className="card p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg bg-primary-100 flex items-center justify-center">
                        <Clock className="w-8 h-8 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{apt.customer_name}</p>
                            <p className="text-sm text-gray-600">{apt.customer_phone}</p>
                          </div>
                          <span
                            className={`badge ${
                              apt.status === 'scheduled'
                                ? 'badge-warning'
                                : apt.status === 'completed'
                                ? 'badge-success'
                                : 'badge-gray'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          {formatDateTime(apt.scheduled_at)}
                        </div>
                        {room && (
                          <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                            <span>Phòng {room.room_number}</span>
                            {room.building && <span>- {room.building.district}</span>}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <a href={`tel:${apt.customer_phone}`} className="btn-sm btn-secondary">
                          <Phone className="w-4 h-4" />
                        </a>
                        {apt.status === 'scheduled' && (
                          <button onClick={() => setCheckInModal(true)} className="btn-sm btn-success">
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Check-in Modal */}
      <Modal
        isOpen={checkInModal}
        onClose={() => setCheckInModal(false)}
        title="Xác nhận Check-in"
        description="Xác nhận bạn đã đến địa điểm xem phòng"
      >
        <div className="space-y-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <div className="flex items-center gap-2 text-primary-700">
              <MapPin className="w-5 h-5" />
              <span>GPS: Đang xác định vị trí...</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Check-in sẽ ghi nhận vị trí hiện tại của bạn và thông báo cho khách hàng rằng bạn đã đến.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setCheckInModal(false)} className="btn-secondary flex-1">
              Hủy
            </button>
            <button className="btn-primary flex-1">
              <Check className="w-4 h-4 mr-2" />
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
