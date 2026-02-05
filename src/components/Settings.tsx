import { useRef } from 'react'
import type { AppState } from '../types'
import { exportToJSON, importFromJSON } from '../utils/exportImport'

interface SettingsProps {
  appState: AppState
  onImport: (data: AppState) => void
  onClose: () => void
}

export default function Settings({ appState, onImport, onClose }: SettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    exportToJSON(appState)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const data = await importFromJSON(file)
      if (confirm(`Import ${data.trips.length} trips? ข้อมูลปัจจุบันจะถูกแทนที่`)) {
        onImport(data)
        alert('✓ Import สำเร็จ!')
        onClose()
      }
    } catch (error) {
      alert('❌ Import ล้มเหลว: ' + (error as Error).message)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">⚙️ ตั้งค่า</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Export/Import Section */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-700 mb-3">📤 Export / Import</h3>

            <div className="space-y-2">
              <button
                onClick={handleExport}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <span>💾</span>
                <span>Export ข้อมูลทั้งหมด (JSON)</span>
              </button>

              <button
                onClick={handleImportClick}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <span>📥</span>
                <span>Import ข้อมูล (JSON)</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <p className="text-xs text-gray-500 mt-2">
              💡 Export เพื่อ backup ข้อมูล หรือย้ายไปเครื่องอื่น
            </p>
          </div>

          {/* Stats Section */}
          <div className="pt-4">
            <h3 className="font-semibold text-gray-700 mb-3">📊 สถิติ</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-blue-600 font-medium">ทริปทั้งหมด</div>
                <div className="text-2xl font-bold text-blue-900">{appState.trips.length}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-green-600 font-medium">รายการค่าใช้จ่าย</div>
                <div className="text-2xl font-bold text-green-900">{appState.expenses.length}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-purple-600 font-medium">แผนวัน</div>
                <div className="text-2xl font-bold text-purple-900">{appState.dayPlans.length}</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-orange-600 font-medium">รายการเตรียมของ</div>
                <div className="text-2xl font-bold text-orange-900">{appState.packingItems.length}</div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 text-center">
              Travel Planner Pro v1.0<br />
              Made with ❤️ by Claude
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
