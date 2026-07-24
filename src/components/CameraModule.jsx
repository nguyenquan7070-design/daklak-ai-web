import { useState } from 'react'
import { CAMERA_LOCATIONS } from '../data/screens'
import { analyzeImage } from '../services/geminiService'
import * as storage from '../services/storage'
import Header from './Header'

const ALERT_COLOR = {
  'Khẩn cấp': '#e2593c',
  Cao: '#e8a33d',
  'Trung bình': '#2c8fa0',
  Thấp: '#4fae7f',
}

const SCENARIOS = [
  { key: 'congest', label: 'Ùn tắc giao thông', prompt: 'Phân tích tình trạng ùn tắc xe cộ tại camera này.' },
  { key: 'flood', label: 'Ngập lụt đô thị', prompt: 'Phân tích tình trạng ngập nước quanh khu vực camera này.' },
  { key: 'accident', label: 'Tai nạn va quệt', prompt: 'Phân tích va chạm giao thông ghi nhận tại camera này.' },
]

export default function CameraModule({ onBack }) {
  const [selectedCam, setSelectedCam] = useState(0)
  const [scenario, setScenario] = useState('congest')
  const [isLoading, setIsLoading] = useState(false)
  const [reports, setReports] = useState(() => storage.getReports('camera'))

  const activeScenario = SCENARIOS.find((s) => s.key === scenario)

  async function runAnalysis() {
    setIsLoading(true)
    const result = await analyzeImage('camera', activeScenario.prompt, scenario)
    const report = {
      cameraId: CAMERA_LOCATIONS[selectedCam],
      aiAnalysis: result.classification,
      alertLevel: result.alertLevel || 'Thấp',
    }
    setReports(storage.addReport('camera', report))
    setIsLoading(false)
  }

  return (
    <div className="screen" style={{ '--accent': '#2c8fa0' }}>
      <Header title="AI Camera thông minh" accent="#2c8fa0" onBack={onBack} />
      <div className="screen-intro">Mắt thần đô thị — giám sát 24/7 các điểm nút giao thông trọng yếu</div>
      <div className="screen-body">
        <div className="panel">
          <h4>📹 Chọn trạm camera</h4>
          <div className="camera-grid">
            {CAMERA_LOCATIONS.map((loc, idx) => (
              <div
                key={loc}
                className={`camera-tile ${selectedCam === idx ? 'active' : ''}`}
                onClick={() => setSelectedCam(idx)}
              >
                <div className="live-badge">
                  <span className="dot" /> LIVE
                </div>
                <div className="label">{loc}</div>
              </div>
            ))}
          </div>

          <label className="field-label">Kịch bản phân tích</label>
          <div className="chip-row">
            {SCENARIOS.map((s) => (
              <button
                key={s.key}
                className={`chip ${scenario === s.key ? 'active' : ''}`}
                onClick={() => setScenario(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="limitation-note" style={{ marginBottom: 12 }}>
            Bản Web hiện hiển thị camera dạng danh sách mô phỏng. Khi đóng gói bằng Capacitor cho di động, mục
            này có thể kết nối luồng camera thật (RTSP/HLS) nếu tỉnh cung cấp API công khai.
          </div>

          <button className="btn-primary" onClick={runAnalysis} disabled={isLoading}>
            {isLoading ? 'Đang phân tích...' : `Chạy phân tích AI cho ${CAMERA_LOCATIONS[selectedCam]}`}
          </button>

          {reports.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <label className="field-label">Nhật ký phân tích ({reports.length})</label>
              <div className="report-row">
                {reports.map((r) => (
                  <div key={r.id} className="report-tile">
                    <span
                      className="badge"
                      style={{
                        background: `${ALERT_COLOR[r.alertLevel] || '#7d7266'}22`,
                        color: ALERT_COLOR[r.alertLevel] || '#b9ab98',
                      }}
                    >
                      {r.alertLevel}
                    </span>
                    <div className="title">{r.aiAnalysis}</div>
                    <div className="desc">{r.cameraId}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
