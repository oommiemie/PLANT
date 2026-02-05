import { useState } from 'react'
import type { Trip, Document } from '../types'
import { generateId } from '../utils/helpers'

interface DocumentManagerProps {
  trip: Trip
  documents: Document[]
  onUpdateDocuments: (documents: Document[]) => void
}

const DOCUMENT_TYPES = {
  flight: { label: 'ตั๋วเครื่องบิน', icon: '✈️', color: 'bg-blue-100 text-blue-700' },
  hotel: { label: 'โรงแรม', icon: '🏨', color: 'bg-purple-100 text-purple-700' },
  insurance: { label: 'ประกันการเดินทาง', icon: '🛡️', color: 'bg-green-100 text-green-700' },
  visa: { label: 'วีซ่า', icon: '📋', color: 'bg-orange-100 text-orange-700' },
  other: { label: 'อื่นๆ', icon: '📄', color: 'bg-gray-100 text-gray-700' },
}

export default function DocumentManager({ trip, documents, onUpdateDocuments }: DocumentManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)

  const handleSaveDocument = (document: Document) => {
    if (editingDocument) {
      onUpdateDocuments(documents.map(d => d.id === document.id ? document : d))
    } else {
      onUpdateDocuments([document, ...documents])
    }
    setShowForm(false)
    setEditingDocument(null)
  }

  const handleDeleteDocument = (documentId: string) => {
    if (!confirm('ลบเอกสารนี้?')) return
    onUpdateDocuments(documents.filter(d => d.id !== documentId))
  }

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document)
    setShowForm(true)
  }

  const documentsByType = Object.keys(DOCUMENT_TYPES).reduce((acc, type) => {
    const typeDocuments = documents.filter(d => d.type === type)
    return { ...acc, [type]: typeDocuments }
  }, {} as Record<string, Document[]>)

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">เอกสารสำคัญ</h3>
            <p className="text-sm text-gray-600 mt-1">เก็บรวบรวมเอกสารและเลขยืนยันต่างๆ</p>
          </div>
          <button
            onClick={() => {
              setEditingDocument(null)
              setShowForm(true)
            }}
            className="btn-primary"
          >
            ➕ เพิ่มเอกสาร
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-3">📄</div>
            <p>ยังไม่มีเอกสาร</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(documentsByType).map(([type, docs]) => {
              if (docs.length === 0) return null
              const typeInfo = DOCUMENT_TYPES[type as keyof typeof DOCUMENT_TYPES]

              return (
                <div key={type}>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center space-x-2">
                    <span className="text-xl">{typeInfo.icon}</span>
                    <span>{typeInfo.label}</span>
                    <span className="text-sm text-gray-500">({docs.length})</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {docs.map(doc => (
                      <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{typeInfo.icon}</span>
                            <h5 className="font-semibold text-gray-900">{doc.title}</h5>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditDocument(doc)}
                              className="text-gray-400 hover:text-blue-600"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        {doc.confirmationNumber && (
                          <div className="bg-gray-50 rounded px-3 py-2 mb-2">
                            <div className="text-xs text-gray-600 mb-1">เลขยืนยัน</div>
                            <div className="font-mono font-semibold text-gray-900">
                              {doc.confirmationNumber}
                            </div>
                          </div>
                        )}

                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline inline-flex items-center space-x-1"
                          >
                            <span>🔗</span>
                            <span>ดูไฟล์</span>
                          </a>
                        )}

                        {doc.notes && (
                          <p className="text-sm text-gray-600 mt-2">{doc.notes}</p>
                        )}
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
        <DocumentForm
          document={editingDocument}
          tripId={trip.id}
          onSave={handleSaveDocument}
          onCancel={() => {
            setShowForm(false)
            setEditingDocument(null)
          }}
        />
      )}
    </div>
  )
}

interface DocumentFormProps {
  document: Document | null
  tripId: string
  onSave: (document: Document) => void
  onCancel: () => void
}

function DocumentForm({ document, tripId, onSave, onCancel }: DocumentFormProps) {
  const [formData, setFormData] = useState({
    type: document?.type || 'other' as Document['type'],
    title: document?.title || '',
    confirmationNumber: document?.confirmationNumber || '',
    fileUrl: document?.fileUrl || '',
    notes: document?.notes || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) {
      alert('กรุณากรอกชื่อเอกสาร')
      return
    }

    onSave({
      id: document?.id || generateId(),
      tripId,
      ...formData,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <h3 className="text-xl font-bold mb-4">
          {document ? 'แก้ไขเอกสาร' : 'เพิ่มเอกสาร'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทเอกสาร *</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as Document['type'] })}
              className="input-field"
              required
            >
              {Object.entries(DOCUMENT_TYPES).map(([key, type]) => (
                <option key={key} value={key}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อเอกสาร *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              placeholder="เช่น Thai Airways TG661"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เลขยืนยัน / Booking Reference</label>
            <input
              type="text"
              value={formData.confirmationNumber}
              onChange={e => setFormData({ ...formData, confirmationNumber: e.target.value })}
              className="input-field"
              placeholder="เช่น ABC123XYZ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ลิงก์ไฟล์ / URL</label>
            <input
              type="url"
              value={formData.fileUrl}
              onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
              className="input-field"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows={3}
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
