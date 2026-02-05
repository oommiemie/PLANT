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
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🗺️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">ยังไม่มีทริปท่องเที่ยว</h3>
        <p className="text-gray-600 mb-6">เริ่มต้นวางแผนการเดินทางของคุณกันเถอะ!</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">ทริปท่องเที่ยวของคุณ</h2>
        <p className="text-gray-600 mt-1">มีทั้งหมด {trips.length} ทริป</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map(trip => {
          const days = calculateDays(trip.startDate, trip.endDate)

          return (
            <div
              key={trip.id}
              className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
              onClick={() => onSelectTrip(trip.id)}
            >
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center text-white text-5xl">
                {trip.coverImage ? (
                  <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  '🌍'
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {trip.name}
                    </h3>
                    {getStatusBadge(trip.status)}
                  </div>
                  <div className="flex items-center text-gray-600 space-x-2">
                    <span>📍</span>
                    <span className="font-medium">{trip.destination}, {trip.country}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📅</span>
                    <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">⏱️</span>
                    <span>{days} วัน {days - 1} คืน</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">💰</span>
                    <span className="font-semibold">{formatCurrency(trip.budget, trip.currency)}</span>
                  </div>
                </div>

                {trip.notes && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {trip.notes}
                  </p>
                )}

                <div className="pt-4 border-t border-gray-200 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditTrip(trip)
                    }}
                    className="flex-1 btn-secondary text-sm py-1.5"
                  >
                    ✏️ แก้ไข
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteTrip(trip.id)
                    }}
                    className="btn-danger"
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
