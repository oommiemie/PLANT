import type { Trip } from '../types'
import { formatDate, calculateDays, formatCurrency } from '../utils/helpers'

interface TripListProps {
  trips: Trip[]
  onSelectTrip: (tripId: string) => void
  onEditTrip: (trip: Trip) => void
  onDeleteTrip: (tripId: string) => void
}

export default function TripList({ trips, onSelectTrip, onEditTrip, onDeleteTrip }: TripListProps) {
  const getStatusBadge = (status: Trip['status']) => {
    const badges = {
      planning: 'badge badge-planning',
      booked: 'badge badge-booked',
      ongoing: 'badge badge-ongoing',
      completed: 'badge badge-completed',
    }
    const labels = {
      planning: 'กำลังวางแผน',
      booked: 'จองแล้ว',
      ongoing: 'กำลังเดินทาง',
      completed: 'เสร็จสิ้น',
    }
    return <span className={badges[status]}>{labels[status]}</span>
  }

  if (trips.length === 0) {
    return (
      <div className="card text-center py-20 sm:py-32">
        <div className="mb-8 relative inline-block">
          <div className="text-8xl sm:text-9xl mb-4 animate-float">🗺️</div>
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
          ยังไม่มีทริปท่องเที่ยว
        </h3>
        <p className="text-base sm:text-lg text-gray-600 font-medium mb-8 max-w-md mx-auto">
          เริ่มต้นวางแผนการเดินทางสุดพิเศษของคุณกันเถอะ! ✨
        </p>
        <div className="flex gap-2 justify-center text-4xl sm:text-5xl opacity-40">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>✈️</span>
          <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🌍</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🏖️</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">ทริปท่องเที่ยวของคุณ</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">มีทั้งหมด {trips.length} ทริป</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {trips.map(trip => {
          const days = calculateDays(trip.startDate, trip.endDate)

          return (
            <div
              key={trip.id}
              className="card cursor-pointer group active:scale-[0.98]"
              onClick={() => onSelectTrip(trip.id)}
            >
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 flex items-center justify-center text-white text-4xl sm:text-5xl overflow-hidden">
                {trip.coverImage ? (
                  <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
                ) : (
                  '🌍'
                )}
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div>
                  <div className="flex items-start justify-between mb-1 sm:mb-2 gap-2">
                    <h3 className="text-base sm:text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {trip.name}
                    </h3>
                    {getStatusBadge(trip.status)}
                  </div>
                  <div className="flex items-center text-gray-600 space-x-1 sm:space-x-2">
                    <span className="text-sm sm:text-base">📍</span>
                    <span className="font-medium text-sm sm:text-base line-clamp-1">{trip.destination}, {trip.country}</span>
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-1 sm:mr-2">📅</span>
                    <span className="line-clamp-1">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-1 sm:mr-2">⏱️</span>
                    <span>{days} วัน {days - 1} คืน</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-1 sm:mr-2">💰</span>
                    <span className="font-semibold">{formatCurrency(trip.budget, trip.currency)}</span>
                  </div>
                </div>

                {trip.notes && (
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                    {trip.notes}
                  </p>
                )}

                <div className="pt-3 sm:pt-4 border-t border-gray-200/50 flex gap-1.5 sm:gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditTrip(trip)
                    }}
                    className="flex-1 btn-secondary text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-6"
                  >
                    <span className="inline sm:hidden">✏️</span>
                    <span className="hidden sm:inline">✏️ แก้ไข</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteTrip(trip.id)
                    }}
                    className="btn-danger px-3 sm:px-4 text-base sm:text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
