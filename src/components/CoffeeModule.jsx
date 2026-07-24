import { useRef, useState } from 'react'
import { analyzeImage } from '../services/geminiService'
import * as storage from '../services/storage'
import ChatScreen from './ChatScreen'

const PARTS = [
  { key: 'leaf', label: 'Lá cà phê' },
  { key: 'fruit', label: 'Quả cà phê' },
  { key: 'stem', label: 'Thân cây' },
]

const HAZARD_COLOR = {
  'Nguy hiểm': '#e2593c',
  Cao: '#e8a33d',
  'Trung bình': '#4fae7f',
}

export default function CoffeeModule({ onBack }) {
  const [part, setPart] = useState('leaf')
  const [prompt, setPrompt] = useState('Xác định bệnh và hướng xử lý bám sát ảnh.')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [reports, setReports] = useState(() => storage.getReports('coffee'))
  const [refreshKey, setRefreshKey] = useState(0)
  const fileInput = useRef(null)

  function onFileChange(e) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function runAnalysis() {
    setIsLoading(true)
    const partLabel = PARTS.find((p) => p.key === part)?.label || 'Lá cà phê'
    const imageLabel = file ? file.name : part
    const result = await analyzeImage('coffee', prompt, imageLabel)

    const report = {
      partType: partLabel,
      diseaseName: result.title,
      condition: result.condition,
      hazardLevel: result.hazard,
      treatment: result.treatment,
    }
    const nextReports = storage.addReport('coffee', report)
    setReports(nextReports)

    storage.addMessage('coffee', {
      isUser: true,
      text: `Gửi ảnh khảo sát ${partLabel.toLowerCase()}${file ? ` (${file.name})` : ''}: ${prompt}`,
    })
    storage.addMessage('coffee', { isUser: false, text: result.text })
    setRefreshKey((k) => k + 1)
    setIsLoading(false)
  }

  return (
    <ChatScreen
      key={refreshKey}
      screenId="coffee"
      onBack={onBack}
      introText="Chẩn đoán lâm sàng cà phê Buôn Ma Thuột bằng AI thị giác"
    >
      <div className="panel">
        <h4>☕ Chẩn đoán bệnh cà phê</h4>
        <div className="chip-row">
          {PARTS.map((p) => (
            <button
              key={p.key}
              className={`chip ${part === p.key ? 'active' : ''}`}
              style={part === p.key ? { background: 'var(--accent)' } : undefined}
              onClick={() => setPart(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {preview ? (
          <div className="file-preview">
            <img src={preview} alt="Ảnh khảo sát" />
            <div style={{ flex: 1, fontSize: 12, color: 'var(--ink-dim)' }}>{file?.name}</div>
            <button className="btn-secondary" onClick={() => { setFile(null); setPreview(null) }}>
              Gỡ ảnh
            </button>
          </div>
        ) : (
          <div className="file-drop" onClick={() => fileInput.current?.click()}>
            📷 Bấm để chọn ảnh lá / quả / thân cây (tùy chọn — không có ảnh vẫn chạy được bằng mô tả văn bản)
          </div>
        )}
        <input ref={fileInput} type="file" accept="image/*" hidden onChange={onFileChange} />

        <label className="field-label">Mô tả / yêu cầu phân tích</label>
        <textarea className="textarea-input" value={prompt} onChange={(e) => setPrompt(e.target.value)} />

        <button className="btn-primary" onClick={runAnalysis} disabled={isLoading}>
          {isLoading ? 'Đang phân tích cùng AI...' : 'Gửi ảnh phân tích'}
        </button>

        {reports.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <label className="field-label">Lịch sử phân tích ({reports.length})</label>
            <div className="report-row">
              {reports.map((r) => (
                <div key={r.id} className="report-tile">
                  <span
                    className="badge"
                    style={{
                      background: `${HAZARD_COLOR[r.hazardLevel] || '#7d7266'}22`,
                      color: HAZARD_COLOR[r.hazardLevel] || '#b9ab98',
                    }}
                  >
                    {r.hazardLevel}
                  </span>
                  <div className="title">{r.diseaseName}</div>
                  <div className="desc">{r.partType} · {r.treatment}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ChatScreen>
  )
}
