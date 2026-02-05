import { supabase } from '../lib/supabase'
import type { Trip, DayPlan, Activity, Expense, Document, PackingItem } from '../types'

// ==================== TRIPS ====================

export async function getAllTrips(userId: string): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getTripById(id: string): Promise<Trip | null> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createTrip(trip: Omit<Trip, 'createdAt' | 'updatedAt'>): Promise<Trip> {
  const { data, error } = await supabase
    .from('trips')
    .insert({
      id: trip.id,
      user_id: trip.id, // temporary: will be replaced with real user_id after auth
      name: trip.name,
      destination: trip.destination,
      country: trip.country,
      start_date: trip.startDate,
      end_date: trip.endDate,
      budget: trip.budget,
      currency: trip.currency,
      notes: trip.notes,
      cover_image: trip.coverImage,
      status: trip.status
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
  const updateData: any = {}

  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.destination !== undefined) updateData.destination = updates.destination
  if (updates.country !== undefined) updateData.country = updates.country
  if (updates.startDate !== undefined) updateData.start_date = updates.startDate
  if (updates.endDate !== undefined) updateData.end_date = updates.endDate
  if (updates.budget !== undefined) updateData.budget = updates.budget
  if (updates.currency !== undefined) updateData.currency = updates.currency
  if (updates.notes !== undefined) updateData.notes = updates.notes
  if (updates.coverImage !== undefined) updateData.cover_image = updates.coverImage
  if (updates.status !== undefined) updateData.status = updates.status

  updateData.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('trips')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTrip(id: string): Promise<void> {
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ==================== DAY PLANS ====================

export async function getDayPlansByTrip(tripId: string): Promise<DayPlan[]> {
  const { data, error } = await supabase
    .from('day_plans')
    .select('*')
    .eq('trip_id', tripId)
    .order('day_number', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createDayPlan(dayPlan: Omit<DayPlan, 'createdAt'>): Promise<DayPlan> {
  const { data, error } = await supabase
    .from('day_plans')
    .insert({
      id: dayPlan.id,
      trip_id: dayPlan.tripId,
      user_id: dayPlan.tripId, // temporary: will be replaced with real user_id
      date: dayPlan.date,
      day_number: dayPlan.dayNumber,
      notes: dayPlan.notes
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateDayPlan(id: string, updates: Partial<DayPlan>): Promise<DayPlan> {
  const updateData: any = {}

  if (updates.date !== undefined) updateData.date = updates.date
  if (updates.dayNumber !== undefined) updateData.day_number = updates.dayNumber
  if (updates.notes !== undefined) updateData.notes = updates.notes

  const { data, error } = await supabase
    .from('day_plans')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteDayPlan(id: string): Promise<void> {
  const { error } = await supabase
    .from('day_plans')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ==================== ACTIVITIES ====================

export async function getActivitiesByDayPlan(dayPlanId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('day_plan_id', dayPlanId)
    .order('time', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createActivity(activity: Activity & { dayPlanId: string }): Promise<Activity> {
  const { data, error } = await supabase
    .from('activities')
    .insert({
      id: activity.id,
      day_plan_id: activity.dayPlanId,
      user_id: activity.dayPlanId, // temporary
      time: activity.time,
      title: activity.title,
      location: activity.location,
      description: activity.description,
      estimated_cost: activity.estimatedCost,
      booking_required: activity.bookingRequired,
      booking_url: activity.bookingUrl,
      completed: activity.completed
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateActivity(id: string, updates: Partial<Activity>): Promise<Activity> {
  const updateData: any = {}

  if (updates.time !== undefined) updateData.time = updates.time
  if (updates.title !== undefined) updateData.title = updates.title
  if (updates.location !== undefined) updateData.location = updates.location
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.estimatedCost !== undefined) updateData.estimated_cost = updates.estimatedCost
  if (updates.bookingRequired !== undefined) updateData.booking_required = updates.bookingRequired
  if (updates.bookingUrl !== undefined) updateData.booking_url = updates.bookingUrl
  if (updates.completed !== undefined) updateData.completed = updates.completed

  const { data, error } = await supabase
    .from('activities')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteActivity(id: string): Promise<void> {
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ==================== EXPENSES ====================

export async function getExpensesByTrip(tripId: string): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('trip_id', tripId)
    .order('date', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createExpense(expense: Omit<Expense, 'createdAt'>): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      id: expense.id,
      trip_id: expense.tripId,
      user_id: expense.tripId, // temporary
      date: expense.date,
      category: expense.category,
      amount: expense.amount,
      currency: expense.currency,
      description: expense.description,
      notes: expense.notes
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateExpense(id: string, updates: Partial<Expense>): Promise<Expense> {
  const updateData: any = {}

  if (updates.date !== undefined) updateData.date = updates.date
  if (updates.category !== undefined) updateData.category = updates.category
  if (updates.amount !== undefined) updateData.amount = updates.amount
  if (updates.currency !== undefined) updateData.currency = updates.currency
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.notes !== undefined) updateData.notes = updates.notes

  const { data, error } = await supabase
    .from('expenses')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ==================== DOCUMENTS ====================

export async function getDocumentsByTrip(tripId: string): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createDocument(document: Omit<Document, 'createdAt'>): Promise<Document> {
  const { data, error } = await supabase
    .from('documents')
    .insert({
      id: document.id,
      trip_id: document.tripId,
      user_id: document.tripId, // temporary
      type: document.type,
      title: document.title,
      confirmation_number: document.confirmationNumber,
      file_url: document.fileUrl,
      notes: document.notes
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
  const updateData: any = {}

  if (updates.type !== undefined) updateData.type = updates.type
  if (updates.title !== undefined) updateData.title = updates.title
  if (updates.confirmationNumber !== undefined) updateData.confirmation_number = updates.confirmationNumber
  if (updates.fileUrl !== undefined) updateData.file_url = updates.fileUrl
  if (updates.notes !== undefined) updateData.notes = updates.notes

  const { data, error } = await supabase
    .from('documents')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteDocument(id: string): Promise<void> {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ==================== PACKING ITEMS ====================

export async function getPackingItemsByTrip(tripId: string): Promise<PackingItem[]> {
  const { data, error } = await supabase
    .from('packing_items')
    .select('*')
    .eq('trip_id', tripId)
    .order('category', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createPackingItem(item: Omit<PackingItem, 'createdAt'>): Promise<PackingItem> {
  const { data, error } = await supabase
    .from('packing_items')
    .insert({
      id: item.id,
      trip_id: item.tripId,
      user_id: item.tripId, // temporary
      category: item.category,
      item: item.item,
      quantity: item.quantity,
      packed: item.packed
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePackingItem(id: string, updates: Partial<PackingItem>): Promise<PackingItem> {
  const updateData: any = {}

  if (updates.category !== undefined) updateData.category = updates.category
  if (updates.item !== undefined) updateData.item = updates.item
  if (updates.quantity !== undefined) updateData.quantity = updates.quantity
  if (updates.packed !== undefined) updateData.packed = updates.packed

  const { data, error } = await supabase
    .from('packing_items')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePackingItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('packing_items')
    .delete()
    .eq('id', id)

  if (error) throw error
}
