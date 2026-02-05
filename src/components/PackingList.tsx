import { useState } from 'react'
import type { Trip, PackingItem } from '../types'
import { generateId } from '../utils/helpers'

interface PackingListProps {
  trip: Trip
  packingItems: PackingItem[]
  onUpdatePackingItems: (items: PackingItem[]) => void
}

const PACKING_CATEGORIES = {
  clothes: { label: 'เสื้อผ้า', icon: '👕', color: 'bg-blue-100 text-blue-700' },
  toiletries: { label: 'ของใช้ส่วนตัว', icon: '🧴', color: 'bg-purple-100 text-purple-700' },
  electronics: { label: 'อุปกรณ์อิเล็กทรอนิกส์', icon: '📱', color: 'bg-green-100 text-green-700' },
  documents: { label: 'เอกสารสำคัญ', icon: '📋', color: 'bg-orange-100 text-orange-700' },
  other: { label: 'อื่นๆ', icon: '🎒', color: 'bg-gray-100 text-gray-700' },
}

export default function PackingList({ trip, packingItems, onUpdatePackingItems }: PackingListProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<PackingItem | null>(null)

  const handleSaveItem = (item: PackingItem) => {
    if (editingItem) {
      onUpdatePackingItems(packingItems.map(i => i.id === item.id ? item : i))
    } else {
      onUpdatePackingItems([...packingItems, item])
    }
    setShowForm(false)
    setEditingItem(null)
  }

  const handleDeleteItem = (itemId: string) => {
    if (!confirm('ลบรายการนี้?')) return
    onUpdatePackingItems(packingItems.filter(i => i.id !== itemId))
  }

  const handleTogglePacked = (itemId: string) => {
    onUpdatePackingItems(
      packingItems.map(item =>
        item.id === itemId ? { ...item, packed: !item.packed } : item
      )
    )
  }

  const itemsByCategory = Object.keys(PACKING_CATEGORIES).reduce((acc, category) => {
    const categoryItems = packingItems.filter(i => i.category === category)
    const packedCount = categoryItems.filter(i => i.packed).length
    return {
      ...acc,
      [category]: {
        items: categoryItems,
        total: categoryItems.length,
        packed: packedCount,
      },
    }
  }, {} as Record<string, { items: PackingItem[]; total: number; packed: number }>)

  const totalItems = packingItems.length
  const packedItems = packingItems.filter(i => i.packed).length
  const packingProgress = totalItems > 0 ? (packedItems / totalItems) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">รายการเตรียมสัมภาระ</h3>
            <p className="text-sm text-gray-600 mt-1">
              เตรียมของแล้ว {packedItems} / {totalItems} รายการ
            </p>
          </div>
          <button
            onClick={() => {
              setEditingItem(null)
              setShowForm(true)
            }}
            className="btn-primary"
          >
            ➕ เพิ่มรายการ
          </button>
        </div>

        {/* Progress Bar */}
        {totalItems > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">ความคืบหน้า</span>
              <span className="font-semibold">{packingProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                style={{ width: `${packingProgress}%` }}
              />
            </div>
          </div>
        )}

        {totalItems === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-3">🎒</div>
            <p>ยังไม่มีรายการเตรียมสัมภาระ</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(itemsByCategory).map(([category, data]) => {
              if (data.total === 0) return null
              const categoryInfo = PACKING_CATEGORIES[category as keyof typeof PACKING_CATEGORIES]

              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-700 flex items-center space-x-2">
                      <span className="text-xl">{categoryInfo.icon}</span>
                      <span>{categoryInfo.label}</span>
                    </h4>
                    <span className="text-sm text-gray-600">
                      {data.packed} / {data.total}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {data.items.map(item => (
                      <div
                        key={item.id}
                        className={`border rounded-lg p-3 transition-all ${
                          item.packed
                            ? 'bg-gray-50 border-gray-300'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <input
                              type="checkbox"
                              checked={item.packed}
                              onChange={() => handleTogglePacked(item.id)}
                              className="w-5 h-5 text-primary-600 rounded cursor-pointer"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`font-medium ${
                                    item.packed ? 'line-through text-gray-500' : 'text-gray-900'
                                  }`}
                                >
                                  {item.item}
                                </span>
                                {item.quantity > 1 && (
                                  <span className="text-sm text-gray-500">
                                    x{item.quantity}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingItem(item)
                                setShowForm(true)
                              }}
                              className="text-gray-400 hover:text-blue-600"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showForm && (
        <PackingItemForm
          item={editingItem}
          tripId={trip.id}
          onSave={handleSaveItem}
          onCancel={() => {
            setShowForm(false)
            setEditingItem(null)
          }}
        />
      )}
    </div>
  )
}

interface PackingItemFormProps {
  item: PackingItem | null
  tripId: string
  onSave: (item: PackingItem) => void
  onCancel: () => void
}

function PackingItemForm({ item, tripId, onSave, onCancel }: PackingItemFormProps) {
  const [formData, setFormData] = useState({
    category: item?.category || 'other' as PackingItem['category'],
    item: item?.item || '',
    quantity: item?.quantity || 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.item || formData.quantity <= 0) {
      alert('กรุณากรอกชื่อรายการและจำนวน')
      return
    }

    onSave({
      id: item?.id || generateId(),
      tripId,
      ...formData,
      packed: item?.packed || false,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <h3 className="text-xl font-bold mb-4">
          {item ? 'แก้ไขรายการ' : 'เพิ่มรายการ'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่ *</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as PackingItem['category'] })}
              className="input-field"
              required
            >
              {Object.entries(PACKING_CATEGORIES).map(([key, cat]) => (
                <option key={key} value={key}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อรายการ *</label>
            <input
              type="text"
              value={formData.item}
              onChange={e => setFormData({ ...formData, item: e.target.value })}
              className="input-field"
              placeholder="เช่น เสื้อยืด, แปรงสีฟัน, ที่ชาร์จโทรศัพท์"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">จำนวน *</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
              className="input-field"
              min="1"
              required
            />
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
