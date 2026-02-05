import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Trip, DayPlan, Expense, Document, PackingItem } from './types'
import TripList from './components/TripList'
import TripDetail from './components/TripDetail'
import TripForm from './components/TripForm'

function App() {
  const [trips, setTrips] = useLocalStorage<Trip[]>('travel_planner_trips', [])
  const [dayPlans, setDayPlans] = useLocalStorage<DayPlan[]>('travel_planner_day_plans', [])
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('travel_planner_expenses', [])
  const [documents, setDocuments] = useLocalStorage<Document[]>('travel_planner_documents', [])
  const [packingItems, setPackingItems] = useLocalStorage<PackingItem[]>('travel_planner_packing', [])

  const [currentTripId, setCurrentTripId] = useState<string | null>(null)
  const [showTripForm, setShowTripForm] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)

  const currentTrip = trips.find(t => t.id === currentTripId)

  const handleSaveTrip = (trip: Trip) => {
    if (editingTrip) {
      setTrips(trips.map(t => t.id === trip.id ? trip : t))
    } else {
      setTrips([trip, ...trips])
    }
    setShowTripForm(false)
    setEditingTrip(null)
  }

  const handleDeleteTrip = (tripId: string) => {
    if (!confirm('คุณแน่ใจหรือว่าต้องการลบทริปนี้? ข้อมูลทั้งหมดจะถูกลบถาวร')) return

    setTrips(trips.filter(t => t.id !== tripId))
    setDayPlans(dayPlans.filter(d => d.tripId !== tripId))
    setExpenses(expenses.filter(e => e.tripId !== tripId))
    setDocuments(documents.filter(d => d.tripId !== tripId))
    setPackingItems(packingItems.filter(p => p.tripId !== tripId))

    if (currentTripId === tripId) {
      setCurrentTripId(null)
    }
  }

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip)
    setShowTripForm(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">✈️</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Travel Planner Pro</h1>
                <p className="text-sm text-gray-600">วางแผนการเที่ยวต่างประเทศอย่างมืออาชีพ</p>
              </div>
            </div>

            {!showTripForm && !currentTrip && (
              <button
                onClick={() => {
                  setEditingTrip(null)
                  setShowTripForm(true)
                }}
                className="btn-primary flex items-center space-x-2"
              >
                <span>➕</span>
                <span>สร้างทริปใหม่</span>
              </button>
            )}

            {currentTrip && (
              <button
                onClick={() => setCurrentTripId(null)}
                className="btn-secondary flex items-center space-x-2"
              >
                <span>←</span>
                <span>กลับไปรายการทริป</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showTripForm ? (
          <TripForm
            trip={editingTrip}
            onSave={handleSaveTrip}
            onCancel={() => {
              setShowTripForm(false)
              setEditingTrip(null)
            }}
          />
        ) : currentTrip ? (
          <TripDetail
            trip={currentTrip}
            dayPlans={dayPlans.filter(d => d.tripId === currentTrip.id)}
            expenses={expenses.filter(e => e.tripId === currentTrip.id)}
            documents={documents.filter(d => d.tripId === currentTrip.id)}
            packingItems={packingItems.filter(p => p.tripId === currentTrip.id)}
            onUpdateDayPlans={setDayPlans}
            onUpdateExpenses={setExpenses}
            onUpdateDocuments={setDocuments}
            onUpdatePackingItems={setPackingItems}
            onEditTrip={handleEditTrip}
            onDeleteTrip={handleDeleteTrip}
          />
        ) : (
          <TripList
            trips={trips}
            onSelectTrip={setCurrentTripId}
            onEditTrip={handleEditTrip}
            onDeleteTrip={handleDeleteTrip}
          />
        )}
      </main>
    </div>
  )
}

export default App
