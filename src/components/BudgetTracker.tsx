import { useState } from 'react'
import type { Trip, Expense } from '../types'
import { generateId, formatDate } from '../utils/helpers'

interface BudgetTrackerProps {
  trip: Trip
  expenses: Expense[]
  onUpdateExpenses: (expenses: Expense[]) => void
}

const EXPENSE_CATEGORIES = {
  accommodation: { label: 'ที่พัก', icon: '🏨', color: 'bg-blue-100 text-blue-700' },
  food: { label: 'อาหาร', icon: '🍽️', color: 'bg-green-100 text-green-700' },
  transport: { label: 'เดินทาง', icon: '🚗', color: 'bg-purple-100 text-purple-700' },
  activity: { label: 'กิจกรรม', icon: '🎯', color: 'bg-orange-100 text-orange-700' },
  shopping: { label: 'ช้อปปิ้ง', icon: '🛍️', color: 'bg-pink-100 text-pink-700' },
  other: { label: 'อื่นๆ', icon: '💳', color: 'bg-gray-100 text-gray-700' },
}

export default function BudgetTracker({ trip, expenses, onUpdateExpenses }: BudgetTrackerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const remainingBudget = trip.budget - totalExpenses
  const budgetPercentage = trip.budget > 0 ? (totalExpenses / trip.budget) * 100 : 0

  const expensesByCategory = Object.keys(EXPENSE_CATEGORIES).reduce((acc, category) => {
    const categoryExpenses = expenses.filter(e => e.category === category)
    const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0)
    return { ...acc, [category]: { expenses: categoryExpenses, total } }
  }, {} as Record<string, { expenses: Expense[]; total: number }>)

  const handleSaveExpense = (expense: Expense) => {
    if (editingExpense) {
      onUpdateExpenses(expenses.map(e => e.id === expense.id ? expense : e))
    } else {
      onUpdateExpenses([expense, ...expenses])
    }
    setShowForm(false)
    setEditingExpense(null)
  }

  const handleDeleteExpense = (expenseId: string) => {
    if (!confirm('ลบรายการค่าใช้จ่ายนี้?')) return
    onUpdateExpenses(expenses.filter(e => e.id !== expenseId))
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">สรุปงบประมาณ</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">ใช้จ่ายไปแล้ว</span>
              <span className="font-semibold">
                {totalExpenses.toLocaleString()} / {trip.budget.toLocaleString()} {trip.currency}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  budgetPercentage > 100 ? 'bg-red-500' : budgetPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {budgetPercentage.toFixed(1)}% ของงบประมาณ
            </div>
          </div>

          <div className={`p-4 rounded-lg ${remainingBudget >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-sm text-gray-600 mb-1">คงเหลือ</div>
            <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {remainingBudget >= 0 ? '+' : ''}{remainingBudget.toLocaleString()} {trip.currency}
            </div>
          </div>
        </div>
      </div>

      {/* Expenses by Category */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">รายการค่าใช้จ่าย</h3>
          <button
            onClick={() => {
              setEditingExpense(null)
              setShowForm(true)
            }}
            className="btn-primary"
          >
            ➕ เพิ่มรายการ
          </button>
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            ยังไม่มีรายการค่าใช้จ่าย
          </div>
        ) : (
          <div className="space-y-6">
            {/* Category Summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(expensesByCategory).map(([category, data]) => {
                if (data.total === 0) return null
                const categoryInfo = EXPENSE_CATEGORIES[category as keyof typeof EXPENSE_CATEGORIES]
                return (
                  <div key={category} className={`rounded-lg p-3 ${categoryInfo.color}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xl">{categoryInfo.icon}</span>
                      <span className="font-medium text-sm">{categoryInfo.label}</span>
                    </div>
                    <div className="font-bold">
                      {data.total.toLocaleString()} {trip.currency}
                    </div>
                    <div className="text-xs opacity-75">{data.expenses.length} รายการ</div>
                  </div>
                )
              })}
            </div>

            {/* Expense List */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">รายการทั้งหมด</h4>
              {expenses.map(expense => {
                const categoryInfo = EXPENSE_CATEGORIES[expense.category]
                return (
                  <div key={expense.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <span className="text-2xl">{categoryInfo.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{expense.description}</h4>
                            <span className={`badge ${categoryInfo.color}`}>
                              {categoryInfo.label}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            📅 {formatDate(expense.date)}
                          </div>
                          {expense.notes && (
                            <div className="text-sm text-gray-600 mt-1">{expense.notes}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-900">
                            {expense.amount.toLocaleString()} {expense.currency}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditExpense(expense)}
                            className="text-gray-400 hover:text-blue-600"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          tripId={trip.id}
          currency={trip.currency}
          onSave={handleSaveExpense}
          onCancel={() => {
            setShowForm(false)
            setEditingExpense(null)
          }}
        />
      )}
    </div>
  )
}

interface ExpenseFormProps {
  expense: Expense | null
  tripId: string
  currency: string
  onSave: (expense: Expense) => void
  onCancel: () => void
}

function ExpenseForm({ expense, tripId, currency, onSave, onCancel }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    date: expense?.date || new Date().toISOString().split('T')[0],
    category: expense?.category || 'other' as Expense['category'],
    amount: expense?.amount || 0,
    currency: expense?.currency || currency,
    description: expense?.description || '',
    notes: expense?.notes || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || formData.amount <= 0) {
      alert('กรุณากรอกรายละเอียดและจำนวนเงิน')
      return
    }

    onSave({
      id: expense?.id || generateId(),
      tripId,
      ...formData,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <h3 className="text-xl font-bold mb-4">
          {expense ? 'แก้ไขรายการค่าใช้จ่าย' : 'เพิ่มรายการค่าใช้จ่าย'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">วันที่ *</label>
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่ *</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as Expense['category'] })}
              className="input-field"
              required
            >
              {Object.entries(EXPENSE_CATEGORIES).map(([key, cat]) => (
                <option key={key} value={key}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด *</label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              placeholder="เช่น โรงแรม 2 คืน"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนเงิน *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="input-field"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">สกุลเงิน</label>
              <input
                type="text"
                value={formData.currency}
                onChange={e => setFormData({ ...formData, currency: e.target.value })}
                className="input-field"
                placeholder="THB"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows={2}
              placeholder="บันทึกเพิ่มเติม..."
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
