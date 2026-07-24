import { useRef, useState } from 'react'
import { analyzeImage } from '../services/geminiService'
import * as storage from '../services/storage'
import ChatScreen from './ChatScreen'

const TYPES = [
  { key: 'fire', label: 'Báo khói hỏa hoạn', location: 'Yok Don (12.6784, 108.0435)' },
  { key: 'logging', label: 'Khai thác gỗ lén lút', location: 'Ea Súp (12.9102, 107.9511)' },
]

const STATUS_COLOR = {
  'Mới tiếp nhận': '#e8a33d',
  'Đang xử lý': '#2c8fa0',
  'Đã xử lý': '#4fae7f',
}

export default function ForestModule({ onBack }) {
  const [type, setType] = useState('fire')
  const [description, setDescription] = useState(
    'Phát hiện vệt khói xám có dấu hiệu cháy rừng khộp.',
  )
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [reports, setReports] = useState(() => storage.getReports('forest'))
  const [refreshKey, setRefreshKey] = useState(0)
  const fileInput = useRef(null)

  const activeType = TYPES.find((t) => t.key === type)

  function onFileChange(e) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function submitReport() {
    setIsLoading(true)
    const imageLabel = file ? file.name : type
    const result = await analyzeImage('forest', description, imageLabel)

    const report = {
      locationName: activeType.location,
      aiClassification: result.classification,
      status: 'Mới tiếp nhận',
      description,
    }
    setReports(storage.addReport('forest', report))

    storage.addMessage('forest', {
      isUser: true,
      text: `Gửi phản ánh bảo vệ rừng: ${description} (vị trí: ${activeType.location})`,
    })
    storage.addMessage('forest', { isUser: false, text: result.text })
    setRefreshKey((k) => k + 1)
    setIsLoading(false)
  }

  return (
    <ChatScreen
      key={refreshKey}
      screenId="forest"
      onBack={onBack}
      introText="Giám sát bảo vệ rừng khẩn cấp — Yok Don & vùng đệm"
    >
      <div className="panel">
        <h4>🌲 Báo cáo sự cố rừng</h4>
        <div className="chip-row">
          {TYPES.map((t) => (
            <button
              key={t.key}
              className={`chip ${type === t.key ? 'active' : ''}`}
              onClick={() => setType(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="limitation-note" style={{ marginBottom: 12 }}>
          📍 Tọa độ GPS hiện trường (mô phỏng): <strong>{activeType.location}</strong>
        </div>

        {preview ? (
          <div className="file-preview">
            <img src={preview} alt="Ảnh hiện trường" />
            <div style={{ flex: 1, fontSize: 12, color: 'var(--ink-dim)' }}>{file?.name}</div>
            <button className="btn-secondary" onClick={() => { setFile(null); setPreview(null) }}>
              Gỡ ảnh
            </button>
          </div>
        ) : (
          <div className="file-drop" onClick={() => fileInput.current?.click()}>
            📷 Bấm để đính kèm ảnh/video hiện trường (tùy chọn)
          </div>
        )}
        <input ref={fileInput} type="file" accept="image/*" hidden onChange={onFileChange} />

        <label className="field-label">Mô tả hiện trạng thực tế</label>
        <textarea className="textarea-input" value={description} onChange={(e) => setDescription(e.target.value)} />

        <button className="btn-primary" onClick={submitReport} disabled={isLoading}>
          {isLoading ? 'Đang mã hóa & gửi...' : 'Gửi phản ánh bảo vệ rừng'}
        </button>

        {reports.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <label className="field-label">Lực lượng đã tiếp nhận ({reports.length})</label>
            <div className="report-row">
              {reports.map((r) => (
                <div key={r.id} className="report-tile">
                  <span
                    className="badge"
                    style={{
                      background: `${STATUS_COLOR[r.status] || '#7d7266'}22`,
                      color: STATUS_COLOR[r.status] || '#b9ab98',
                    }}
                  >
                    {r.status}
                  </span>
                  <div className="title">{r.aiClassification}</div>
                  <div className="desc">{r.locationName}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ChatScreen>
  )
}
