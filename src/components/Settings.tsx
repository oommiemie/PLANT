import { useRef, useEffect } from 'react'
import type { AppState } from '../types'
import { exportToJSON, importFromJSON } from '../utils/exportImport'

interface SettingsProps {
  appState: AppState
  onImport: (data: AppState) => void
  onClose: () => void
}

export default function Settings({ appState, onImport, onClose }: SettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="glass-modal max-w-md w-full p-6 sm:p-8 animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span className="icon-3d">⚙️</span>
            <span>ตั้งค่า</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl sm:text-4xl leading-none transition-all hover:rotate-90 duration-300"
            title="ปิด (ESC)"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Export/Import Section */}
          <div className="border-b border-gray-200/50 pb-4 sm:pb-6">
            <h3 className="font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="icon-3d">📤</span>
              <span>Export / Import</span>
            </h3>

            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handleExport}
                className="w-full btn-primary flex items-center justify-center space-x-2 py-3 sm:py-3.5"
              >
                <span className="icon-3d text-xl">💾</span>
                <span className="font-semibold">Export ข้อมูล (JSON)</span>
              </button>

              <button
                onClick={handleImportClick}
                className="w-full btn-secondary flex items-center justify-center space-x-2 py-3 sm:py-3.5"
              >
                <span className="icon-3d text-xl">📥</span>
                <span className="font-semibold">Import ข้อมูล (JSON)</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <p className="text-xs sm:text-sm text-gray-500 mt-3 flex items-center gap-1.5">
              <span>💡</span>
              <span>Export เพื่อ backup ข้อมูล หรือย้ายไปเครื่องอื่น</span>
            </p>
          </div>

          {/* Stats Section */}
          <div className="pt-4">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="icon-3d">📊</span>
              <span>สถิติ</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-50/70 backdrop-blur-sm rounded-xl p-3 border border-blue-100/50 shadow-sm hover:shadow-md transition-all hover:scale-105">
                <div className="text-blue-600 font-medium text-xs sm:text-sm">ทริปทั้งหมด</div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-900">{appState.trips.length}</div>
              </div>
              <div className="bg-green-50/70 backdrop-blur-sm rounded-xl p-3 border border-green-100/50 shadow-sm hover:shadow-md transition-all hover:scale-105">
                <div className="text-green-600 font-medium text-xs sm:text-sm">ค่าใช้จ่าย</div>
                <div className="text-2xl sm:text-3xl font-bold text-green-900">{appState.expenses.length}</div>
              </div>
              <div className="bg-purple-50/70 backdrop-blur-sm rounded-xl p-3 border border-purple-100/50 shadow-sm hover:shadow-md transition-all hover:scale-105">
                <div className="text-purple-600 font-medium text-xs sm:text-sm">แผนวัน</div>
                <div className="text-2xl sm:text-3xl font-bold text-purple-900">{appState.dayPlans.length}</div>
              </div>
              <div className="bg-orange-50/70 backdrop-blur-sm rounded-xl p-3 border border-orange-100/50 shadow-sm hover:shadow-md transition-all hover:scale-105">
                <div className="text-orange-600 font-medium text-xs sm:text-sm">เตรียมของ</div>
                <div className="text-2xl sm:text-3xl font-bold text-orange-900">{appState.packingItems.length}</div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="pt-4 border-t border-gray-200/50">
            <p className="text-xs sm:text-sm text-gray-500 text-center leading-relaxed">
              <span className="font-semibold text-gray-700">Travel Planner Pro</span> v1.0<br />
              <span className="inline-flex items-center gap-1 mt-1">
                Made with <span className="icon-3d animate-pulse">❤️</span> by Claude
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
