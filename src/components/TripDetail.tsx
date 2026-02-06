import { useState } from 'react'
import type { Trip, DayPlan, Expense, Document, PackingItem } from '../types'
import { formatDate, calculateDays } from '../utils/helpers'
import ItineraryPlanner from './ItineraryPlanner'
import BudgetTracker from './BudgetTracker'
import DocumentManager from './DocumentManager'
import PackingList from './PackingList'
import WeatherForecast from './WeatherForecast'

interface TripDetailProps {
  trip: Trip
  dayPlans: DayPlan[]
  expenses: Expense[]
  documents: Document[]
  packingItems: PackingItem[]
  onUpdateDayPlans: (dayPlans: DayPlan[]) => void
  onUpdateExpenses: (expenses: Expense[]) => void
  onUpdateDocuments: (documents: Document[]) => void
  onUpdatePackingItems: (items: PackingItem[]) => void
  onEditTrip: (trip: Trip) => void
  onDeleteTrip: (tripId: string) => void
}

type Tab = 'itinerary' | 'budget' | 'documents' | 'packing' | 'weather'

export default function TripDetail({
  trip,
  dayPlans,
  expenses,
  documents,
  packingItems,
  onUpdateDayPlans,
  onUpdateExpenses,
  onUpdateDocuments,
  onUpdatePackingItems,
  onEditTrip,
  onDeleteTrip,
}: TripDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('itinerary')

  const days = calculateDays(trip.startDate, trip.endDate)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remainingBudget = trip.budget - totalExpenses
  const packedItems = packingItems.filter(item => item.packed).length

  const tabs = [
    { id: 'itinerary' as Tab, label: '📅 แผนรายวัน', icon: '📅' },
    { id: 'weather' as Tab, label: '🌤️ สภาพอากาศ', icon: '🌤️' },
    { id: 'budget' as Tab, label: '💰 งบประมาณ', icon: '💰' },
    { id: 'documents' as Tab, label: '📄 เอกสาร', icon: '📄' },
    { id: 'packing' as Tab, label: '🎒 สัมภาระ', icon: '🎒' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.name}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <span className="flex items-center">
                📍 {trip.destination}, {trip.country}
              </span>
              <span className="flex items-center">
                📅 {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </span>
              <span className="flex items-center">
                ⏱️ {days} วัน {days - 1} คืน
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onEditTrip(trip)} className="btn-secondary">
              ✏️ แก้ไข
            </button>
            <button onClick={() => onDeleteTrip(trip.id)} className="btn-danger">
              🗑️ ลบ
            </button>
          </div>
        </div>

        {trip.notes && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-700">{trip.notes}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium mb-1">งบประมาณ</div>
            <div className="text-2xl font-bold text-blue-900">
              {trip.budget.toLocaleString()} {trip.currency}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="text-sm text-purple-600 font-medium mb-1">ใช้ไปแล้ว</div>
            <div className="text-2xl font-bold text-purple-900">
              {totalExpenses.toLocaleString()} {trip.currency}
            </div>
          </div>
          <div className={`bg-gradient-to-br ${remainingBudget >= 0 ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'} rounded-lg p-4`}>
            <div className={`text-sm font-medium mb-1 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              คงเหลือ
            </div>
            <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-900' : 'text-red-900'}`}>
              {remainingBudget.toLocaleString()} {trip.currency}
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="text-sm text-orange-600 font-medium mb-1">เตรียมสัมภาระ</div>
            <div className="text-2xl font-bold text-orange-900">
              {packedItems}/{packingItems.length}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'itinerary' && (
          <ItineraryPlanner
            trip={trip}
            dayPlans={dayPlans}
            onUpdateDayPlans={onUpdateDayPlans}
          />
        )}
        {activeTab === 'weather' && (
          <WeatherForecast trip={trip} />
        )}
        {activeTab === 'budget' && (
          <BudgetTracker
            trip={trip}
            expenses={expenses}
            onUpdateExpenses={onUpdateExpenses}
          />
        )}
        {activeTab === 'documents' && (
          <DocumentManager
            trip={trip}
            documents={documents}
            onUpdateDocuments={onUpdateDocuments}
          />
        )}
        {activeTab === 'packing' && (
          <PackingList
            trip={trip}
            packingItems={packingItems}
            onUpdatePackingItems={onUpdatePackingItems}
          />
        )}
      </div>
    </div>
  )
}
