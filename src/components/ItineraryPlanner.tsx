import { useState, useEffect } from 'react'
import type { Trip, DayPlan, Activity } from '../types'
import { getDatesBetween, formatDateShort, generateId } from '../utils/helpers'

interface ItineraryPlannerProps {
  trip: Trip
  dayPlans: DayPlan[]
  onUpdateDayPlans: (dayPlans: DayPlan[]) => void
}

export default function ItineraryPlanner({ trip, dayPlans, onUpdateDayPlans }: ItineraryPlannerProps) {
  const dates = getDatesBetween(trip.startDate, trip.endDate)

  const [expandedDay, setExpandedDay] = useState<string | null>(null)
  const [editingActivity, setEditingActivity] = useState<{ dayPlanId: string; activity: Activity | null } | null>(null)

  const getDayPlan = (date: string, dayNumber: number): DayPlan => {
    const existing = dayPlans.find(dp => dp.date === date)
    if (existing) return existing

    return {
      id: generateId(),
      tripId: trip.id,
      date,
      dayNumber,
      activities: [],
    }
  }

  const addActivity = (dayPlanId: string) => {
    setEditingActivity({ dayPlanId, activity: null })
  }

  const saveActivity = (dayPlanId: string, activity: Activity) => {
    const dayPlan = dayPlans.find(dp => dp.id === dayPlanId) || getDayPlan('', 0)
    const existingDayPlanIndex = dayPlans.findIndex(dp => dp.id === dayPlanId)

    let updatedActivities: Activity[]
    if (activity.id) {
      updatedActivities = dayPlan.activities.map(a => a.id === activity.id ? activity : a)
    } else {
      updatedActivities = [...dayPlan.activities, { ...activity, id: generateId() }]
    }

    const updatedDayPlan = { ...dayPlan, activities: updatedActivities }

    if (existingDayPlanIndex >= 0) {
      const newDayPlans = [...dayPlans]
      newDayPlans[existingDayPlanIndex] = updatedDayPlan
      onUpdateDayPlans(newDayPlans)
    } else {
      onUpdateDayPlans([...dayPlans, updatedDayPlan])
    }

    setEditingActivity(null)
  }

  const deleteActivity = (dayPlanId: string, activityId: string) => {
    if (!confirm('ลบกิจกรรมนี้?')) return

    const dayPlan = dayPlans.find(dp => dp.id === dayPlanId)
    if (!dayPlan) return

    const updatedActivities = dayPlan.activities.filter(a => a.id !== activityId)
    const updatedDayPlan = { ...dayPlan, activities: updatedActivities }

    onUpdateDayPlans(dayPlans.map(dp => dp.id === dayPlanId ? updatedDayPlan : dp))
  }

  const toggleActivityComplete = (dayPlanId: string, activityId: string) => {
    const dayPlan = dayPlans.find(dp => dp.id === dayPlanId)
    if (!dayPlan) return

    const updatedActivities = dayPlan.activities.map(a =>
      a.id === activityId ? { ...a, completed: !a.completed } : a
    )
    const updatedDayPlan = { ...dayPlan, activities: updatedActivities }

    onUpdateDayPlans(dayPlans.map(dp => dp.id === dayPlanId ? updatedDayPlan : dp))
  }

  // Auto-expand first day on mount
  useEffect(() => {
    if (dates.length > 0 && !expandedDay) {
      const firstDayPlan = getDayPlan(dates[0], 1)
      setExpandedDay(firstDayPlan.id)
    }
  }, [dates.length])

  return (
    <div className="space-y-4">
      {dates.map((date, index) => {
        const dayNumber = index + 1
        const dayPlan = getDayPlan(date, dayNumber)
        const isExpanded = expandedDay === dayPlan.id
        const completedActivities = dayPlan.activities.filter(a => a.completed).length

        return (
          <div key={date} className="card">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedDay(isExpanded ? null : dayPlan.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 text-primary-700 font-bold rounded-lg px-4 py-2">
                  Day {dayNumber}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{formatDateShort(date)}</div>
                  <div className="text-sm text-gray-600">
                    {dayPlan.activities.length} กิจกรรม
                    {completedActivities > 0 && ` (เสร็จแล้ว ${completedActivities})`}
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                {isExpanded ? '▼' : '▶'}
              </button>
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-3">
                {dayPlan.activities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    ยังไม่มีกิจกรรมในวันนี้
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dayPlan.activities.map(activity => (
                      <div
                        key={activity.id}
                        className={`border rounded-lg p-4 ${activity.completed ? 'bg-gray-50 border-gray-300' : 'border-gray-200'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <input
                              type="checkbox"
                              checked={activity.completed}
                              onChange={() => toggleActivityComplete(dayPlan.id, activity.id)}
                              className="mt-1 w-5 h-5 text-primary-600 rounded cursor-pointer"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-600">{activity.time}</span>
                                <h4 className={`font-semibold ${activity.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                  {activity.title}
                                </h4>
                              </div>
                              {activity.location && (
                                <div className="text-sm text-gray-600 mt-1">📍 {activity.location}</div>
                              )}
                              {activity.description && (
                                <div className="text-sm text-gray-600 mt-1">{activity.description}</div>
                              )}
                              {activity.estimatedCost && (
                                <div className="text-sm text-gray-600 mt-1">
                                  💰 ประมาณ {activity.estimatedCost.toLocaleString()} {trip.currency}
                                </div>
                              )}
                              {activity.bookingRequired && (
                                <div className="text-sm text-orange-600 mt-1">
                                  ⚠️ ต้องจองล่วงหน้า
                                  {activity.bookingUrl && (
                                    <a href={activity.bookingUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
                                      ลิงก์จอง
                                    </a>
                                  )}
                                </div>
                              )}
                              {activity.images && activity.images.length > 0 && (
                                <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
                                  {activity.images.map((image, idx) => (
                                    <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-primary-400 transition-colors cursor-pointer group">
                                      <img
                                        src={image}
                                        alt={`รูปที่ ${idx + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                        onClick={() => window.open(image, '_blank')}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingActivity({ dayPlanId: dayPlan.id, activity })}
                              className="text-gray-400 hover:text-blue-600"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteActivity(dayPlan.id, activity.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => addActivity(dayPlan.id)}
                  className="w-full btn-secondary"
                >
                  ➕ เพิ่มกิจกรรม
                </button>
              </div>
            )}
          </div>
        )
      })}

      {editingActivity && (
        <ActivityForm
          activity={editingActivity.activity}
          currency={trip.currency}
          onSave={(activity) => saveActivity(editingActivity.dayPlanId, activity)}
          onCancel={() => setEditingActivity(null)}
        />
      )}
    </div>
  )
}

interface ActivityFormProps {
  activity: Activity | null
  currency: string
  onSave: (activity: Activity) => void
  onCancel: () => void
}

function ActivityForm({ activity, currency, onSave, onCancel }: ActivityFormProps) {
  const [formData, setFormData] = useState({
    time: activity?.time || '',
    title: activity?.title || '',
    location: activity?.location || '',
    description: activity?.description || '',
    estimatedCost: activity?.estimatedCost || 0,
    bookingRequired: activity?.bookingRequired || false,
    bookingUrl: activity?.bookingUrl || '',
    images: activity?.images || [],
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const currentImages = formData.images || []
    if (currentImages.length >= 6) {
      alert('สามารถอัปโหลดภาพได้สูงสุด 6 ภาพ')
      return
    }

    const remainingSlots = 6 - currentImages.length
    const filesToProcess = Array.from(files).slice(0, remainingSlots)

    filesToProcess.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), reader.result as string]
        }))
      }
      reader.readAsDataURL(file)
    })

    e.target.value = ''
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.time || !formData.title) {
      alert('กรุณากรอกเวลาและชื่อกิจกรรม')
      return
    }

    onSave({
      id: activity?.id || '',
      ...formData,
      completed: activity?.completed || false,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h3 className="text-xl font-bold mb-4">
          {activity ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรม'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เวลา *</label>
              <input
                type="time"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อกิจกรรม *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="เช่น เที่ยวตลาดปลา Tsukiji"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">สถานที่</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="input-field"
              placeholder="เช่น Tsukiji Market, Tokyo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="บันทึกรายละเอียดเพิ่มเติม..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ค่าใช้จ่ายโดยประมาณ ({currency})
            </label>
            <input
              type="number"
              value={formData.estimatedCost}
              onChange={e => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
              className="input-field"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.bookingRequired}
                onChange={e => setFormData({ ...formData, bookingRequired: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">ต้องจองล่วงหน้า</span>
            </label>

            {formData.bookingRequired && (
              <input
                type="url"
                value={formData.bookingUrl}
                onChange={e => setFormData({ ...formData, bookingUrl: e.target.value })}
                className="input-field"
                placeholder="https://..."
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รูปภาพ (สูงสุด 6 ภาพ)
            </label>
            <div className="space-y-3">
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={image}
                        alt={`รูปที่ ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {(!formData.images || formData.images.length < 6) && (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.images ? `${formData.images.length}/6 ภาพ` : '0/6 ภาพ'}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button type="submit" className="btn-primary flex-1">
              บันทึก
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
