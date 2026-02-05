export interface Trip {
  id: string
  name: string
  destination: string
  country: string
  startDate: string
  endDate: string
  budget: number
  currency: string
  notes?: string
  coverImage?: string
  status: 'planning' | 'booked' | 'ongoing' | 'completed'
  createdAt: string
  updatedAt: string
}

export interface DayPlan {
  id: string
  tripId: string
  date: string
  dayNumber: number
  activities: Activity[]
  notes?: string
}

export interface Activity {
  id: string
  time: string
  title: string
  location?: string
  description?: string
  estimatedCost?: number
  bookingRequired?: boolean
  bookingUrl?: string
  completed?: boolean
}

export interface Expense {
  id: string
  tripId: string
  date: string
  category: 'accommodation' | 'food' | 'transport' | 'activity' | 'shopping' | 'other'
  amount: number
  currency: string
  description: string
  notes?: string
}

export interface Document {
  id: string
  tripId: string
  type: 'flight' | 'hotel' | 'insurance' | 'visa' | 'other'
  title: string
  confirmationNumber?: string
  fileUrl?: string
  notes?: string
}

export interface PackingItem {
  id: string
  tripId: string
  category: 'clothes' | 'toiletries' | 'electronics' | 'documents' | 'other'
  item: string
  quantity: number
  packed: boolean
}

export interface AppState {
  trips: Trip[]
  dayPlans: DayPlan[]
  expenses: Expense[]
  documents: Document[]
  packingItems: PackingItem[]
  currentTripId: string | null
}
