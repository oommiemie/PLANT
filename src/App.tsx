import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Trip, DayPlan, Expense, Document, PackingItem, AppState } from './types'
import TripList from './components/TripList'
import TripDetail from './components/TripDetail'
import TripForm from './components/TripForm'
import Settings from './components/Settings'

function App() {
  const [trips, setTrips] = useLocalStorage<Trip[]>('travel_planner_trips', [])
  const [dayPlans, setDayPlans] = useLocalStorage<DayPlan[]>('travel_planner_day_plans', [])
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('travel_planner_expenses', [])
  const [documents, setDocuments] = useLocalStorage<Document[]>('travel_planner_documents', [])
  const [packingItems, setPackingItems] = useLocalStorage<PackingItem[]>('travel_planner_packing', [])

  const [currentTripId, setCurrentTripId] = useState<string | null>(null)
  const [showTripForm, setShowTripForm] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [showSettings, setShowSettings] = useState(false)

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

  const handleImport = (data: AppState) => {
    setTrips(data.trips)
    setDayPlans(data.dayPlans)
    setExpenses(data.expenses)
    setDocuments(data.documents)
    setPackingItems(data.packingItems)
    setCurrentTripId(null)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/70 shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <div className="text-2xl sm:text-4xl icon-3d icon-float-3d flex-shrink-0">✈️</div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-primary-400 bg-clip-text text-transparent truncate text-3d">
                  Travel Planner Pro
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 font-medium hidden xs:block">วางแผนการเที่ยวต่างประเทศอย่างมืออาชีพ ✨</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              {!showTripForm && !currentTrip && (
                <>
                  <button
                    onClick={() => {
                      setEditingTrip(null)
                      setShowTripForm(true)
                    }}
                    className="btn-primary flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-3 sm:px-6 py-2 sm:py-3"
                  >
                    <span className="text-lg sm:text-xl">➕</span>
                    <span className="hidden sm:inline">สร้างทริปใหม่</span>
                    <span className="inline sm:hidden">ทริป</span>
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="btn-secondary flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-3 sm:px-6 py-2 sm:py-3"
                    title="ตั้งค่า"
                  >
                    <span className="text-lg sm:text-xl">⚙️</span>
                    <span className="hidden lg:inline">ตั้งค่า</span>
                  </button>
                </>
              )}

              {currentTrip && (
                <button
                  onClick={() => setCurrentTripId(null)}
                  className="btn-secondary flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-3 sm:px-6 py-2 sm:py-3"
                >
                  <span className="text-lg sm:text-xl">←</span>
                  <span className="hidden sm:inline">กลับไปรายการทริป</span>
                  <span className="inline sm:hidden">กลับ</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 sm:pb-8">
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

      {showSettings && (
        <Settings
          appState={{ trips, dayPlans, expenses, documents, packingItems, currentTripId }}
          onImport={handleImport}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default App
