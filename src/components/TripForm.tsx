import { useState, type FormEvent } from 'react'
import type { Trip } from '../types'
import { generateId } from '../utils/helpers'

interface TripFormProps {
  trip: Trip | null
  onSave: (trip: Trip) => void
  onCancel: () => void
}

export default function TripForm({ trip, onSave, onCancel }: TripFormProps) {
  const [formData, setFormData] = useState({
    name: trip?.name || '',
    destination: trip?.destination || '',
    country: trip?.country || '',
    startDate: trip?.startDate || '',
    endDate: trip?.endDate || '',
    budget: trip?.budget || 0,
    currency: trip?.currency || 'THB',
    notes: trip?.notes || '',
    status: trip?.status || 'planning' as Trip['status'],
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.destination || !formData.country || !formData.startDate || !formData.endDate) {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน')
      return
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('วันที่เริ่มต้นต้องไม่เกินวันที่สิ้นสุด')
      return
    }

    const now = new Date().toISOString()
    const tripData: Trip = {
      id: trip?.id || generateId(),
      ...formData,
      createdAt: trip?.createdAt || now,
      updatedAt: now,
    }

    onSave(tripData)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {trip ? '✏️ แก้ไขทริป' : '✨ สร้างทริปใหม่'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อทริป <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="เช่น ทริปญี่ปุ่น 2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ปลายทาง <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={e => setFormData({ ...formData, destination: e.target.value })}
                className="input-field"
                placeholder="เช่น โตเกียว"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประเทศ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
                className="input-field"
                placeholder="เช่น ญี่ปุ่น"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วันที่เริ่มต้น <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วันที่สิ้นสุด <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                งบประมาณ
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="input-field"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สกุลเงิน
              </label>
              <select
                value={formData.currency}
                onChange={e => setFormData({ ...formData, currency: e.target.value })}
                className="input-field"
              >
                <option value="THB">บาท (THB)</option>
                <option value="USD">ดอลลาร์ (USD)</option>
                <option value="EUR">ยูโร (EUR)</option>
                <option value="JPY">เยน (JPY)</option>
                <option value="KRW">วอน (KRW)</option>
                <option value="GBP">ปอนด์ (GBP)</option>
                <option value="SGD">ดอลลาร์สิงคโปร์ (SGD)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สถานะ
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as Trip['status'] })}
                className="input-field"
              >
                <option value="planning">กำลังวางแผน</option>
                <option value="booked">จองแล้ว</option>
                <option value="ongoing">กำลังเดินทาง</option>
                <option value="completed">เสร็จสิ้น</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หมายเหตุ
              </label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="input-field"
                rows={4}
                placeholder="บันทึกข้อมูลเพิ่มเติมเกี่ยวกับทริปนี้..."
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button type="submit" className="btn-primary flex-1">
              {trip ? '💾 บันทึกการแก้ไข' : '✨ สร้างทริป'}
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
