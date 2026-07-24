import { useEffect, useRef, useState } from 'react'
import { DISTRICTS } from '../data/screens'
import Header from './Header'

const COUNTDOWN_SECONDS = 15

export default function AlertSOS({ onBack }) {
  const [districtIdx, setDistrictIdx] = useState(0)
  const [relation, setRelation] = useState('Vợ')
  const [phone, setPhone] = useState('0912345678')
  const [message, setMessage] = useState(
    'CỨU NẠN SOS! Tôi vừa gặp tai nạn khẩn cấp tại Đắk Lắk, cần được giúp đỡ ngay!',
  )
  const [countdown, setCountdown] = useState(null)
  const [showSosPanel, setShowSosPanel] = useState(false)
  const timerRef = useRef(null)

  const district = DISTRICTS[districtIdx]

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  function startSimulatedCountdown() {
    setCountdown(COUNTDOWN_SECONDS)
    timerRef.current = setInterval(() => {
      setCountdown((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current)
          setShowSosPanel(true)
          return null
        }
        return s - 1
      })
    }, 1000)
  }

  function cancelCountdown() {
    clearInterval(timerRef.current)
    setCountdown(null)
  }

  const smsBody = `${message} Toạ độ GPS mô phỏng: 12.6840, 108.0500.`
  const smsHref = `sms:${phone}?body=${encodeURIComponent(smsBody)}`

  return (
    <div className="screen" style={{ '--accent': '#c1442c' }}>
      <Header title="AI Cảnh báo & SOS" accent="#c1442c" onBack={onBack} />
      <div className="screen-intro">Ứng phó thiên tai và cứu hộ khẩn cấp — Đắk Lắk</div>

      <div className="screen-body">
        <div className="panel">
          <h4>1. Chọn khu vực kiểm tra nguy cơ</h4>
          <div className="district-scroll">
            {DISTRICTS.map((d, idx) => (
              <div
                key={d.id}
                className={`district-card ${idx === districtIdx ? 'active' : ''}`}
                onClick={() => setDistrictIdx(idx)}
              >
                <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>{d.name}</div>
                <span className="risk-pill" style={{ background: `${d.riskColor}22`, color: d.riskColor }}>
                  <span className="risk-dot" style={{ background: d.riskColor }} />
                  {d.risk}
                </span>
              </div>
            ))}
          </div>

          <span className="risk-pill" style={{ background: `${district.riskColor}22`, color: district.riskColor, marginBottom: 10 }}>
            <span className="risk-dot" style={{ background: district.riskColor }} />
            {district.risk}
          </span>
          <h4 style={{ marginTop: 10 }}>{district.weatherTitle}</h4>
          <p style={{ fontSize: 13, color: 'var(--ink-dim)', lineHeight: 1.6 }}>{district.weatherText}</p>
          <div className="limitation-note">
            <strong>Khuyến nghị an toàn:</strong> {district.recommendation}
          </div>
        </div>

        <div className="panel sos-hero">
          <h4>🚨 Trung tâm SOS khẩn cấp</h4>
          <label className="field-label">Người thân liên hệ</label>
          <div className="chip-row">
            {['Vợ', 'Chồng', 'Bố', 'Mẹ'].map((r) => (
              <button key={r} className={`chip ${relation === r ? 'active' : ''}`} onClick={() => setRelation(r)}>
                {r}
              </button>
            ))}
          </div>
          <label className="field-label">Số điện thoại {relation}</label>
          <input className="text-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <label className="field-label">Nội dung tin nhắn cứu nạn</label>
          <textarea className="textarea-input" value={message} onChange={(e) => setMessage(e.target.value)} />

          <button className="btn-primary" style={{ background: '#c1442c', marginBottom: 10 }} onClick={() => setShowSosPanel(true)}>
            🚨 KÍCH HOẠT SOS NGAY
          </button>
          <button className="btn-secondary" style={{ width: '100%' }} onClick={startSimulatedCountdown}>
            ⚠️ Giả lập cảm biến va chạm (đếm ngược {COUNTDOWN_SECONDS}s)
          </button>

          <div className="limitation-note">
            <strong>Về giới hạn nền tảng:</strong> trên trình duyệt Web/Desktop, JavaScript không có quyền tự động
            gọi điện hoặc gửi SMS thay bạn — đây là giới hạn bảo mật của mọi trình duyệt, không riêng gì app này.
            Hệ thống sẽ <strong>mở sẵn</strong> ứng dụng Gọi điện / Nhắn tin với nội dung đã điền, bạn chỉ cần bấm
            Gửi/Gọi để xác nhận. Khi đóng gói bản Điện thoại (Capacitor), tính năng tự động gọi 115/gửi SMS thật
            có thể được bật bằng plugin gốc kèm xin quyền người dùng.
          </div>
        </div>
      </div>

      {countdown !== null && (
        <div className="sos-countdown-overlay">
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>PHÁT HIỆN VA CHẠM MẠNH — ĐANG CHUẨN BỊ SOS</div>
          <div className="sos-countdown-number">{countdown}</div>
          <p style={{ fontSize: 12.5, color: 'var(--ink-dim)', maxWidth: 320 }}>
            Nếu không hủy, hệ thống sẽ mở sẵn tin nhắn cứu nạn và gợi ý gọi 115/113 khi đếm về 0.
          </p>
          <button className="btn-primary" style={{ maxWidth: 260, marginTop: 16 }} onClick={cancelCountdown}>
            TÔI VẪN ỔN — HỦY
          </button>
        </div>
      )}

      {showSosPanel && (
        <div className="sos-countdown-overlay" onClick={() => setShowSosPanel(false)}>
          <div className="panel" style={{ maxWidth: 380, textAlign: 'left' }} onClick={(e) => e.stopPropagation()}>
            <h4>🚨 Xác nhận gửi cứu nạn</h4>
            <p style={{ fontSize: 12.5, color: 'var(--ink-dim)' }}>
              Bấm từng nút bên dưới để mở ứng dụng tương ứng trên máy của bạn và xác nhận gửi/gọi.
            </p>
            <a className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginBottom: 10 }} href={smsHref}>
              💬 Mở tin nhắn SOS tới {relation} ({phone})
            </a>
            <a className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', background: '#e2593c', marginBottom: 10 }} href="tel:115">
              📞 Gọi 115 (Cấp cứu)
            </a>
            <a className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', background: '#3b4e9e', marginBottom: 10 }} href="tel:113">
              📞 Gọi 113 (Công an)
            </a>
            <button className="btn-secondary" style={{ width: '100%' }} onClick={() => setShowSosPanel(false)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
