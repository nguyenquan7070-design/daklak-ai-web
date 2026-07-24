import { SCREENS } from '../data/screens'

export default function Home({ onNavigate }) {
  const flagship = SCREENS.filter((s) => s.flagship)
  const rest = SCREENS.filter((s) => !s.flagship)

  return (
    <div className="screen-body" style={{ padding: 0 }}>
      <section className="hero">
        <svg className="hero-contour" viewBox="0 0 800 260" preserveAspectRatio="none">
          <path d="M0 200 Q200 120 400 190 T800 150" stroke="#e8a33d" strokeWidth="1.5" fill="none" />
          <path d="M0 230 Q220 160 420 220 T800 190" stroke="#c2601c" strokeWidth="1.5" fill="none" />
          <path d="M0 170 Q180 90 380 150 T800 110" stroke="#f5efe6" strokeWidth="1" fill="none" />
        </svg>
        <div className="hero-eyebrow">Nền tảng số · Tỉnh Đắk Lắk</div>
        <h2>Đắk Lắk AI</h2>
        <p>
          Trợ lý thông minh đồng hành cùng đời sống người dân Tây Nguyên — từ chẩn đoán bệnh cây cà phê, bảo vệ
          rừng Yok Don, đến cảnh báo thiên tai và cứu hộ khẩn cấp.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="num">12</div>
            <div className="label">dịch vụ AI cộng đồng</div>
          </div>
          <div className="hero-stat">
            <div className="num">24/7</div>
            <div className="label">trực sẵn sàng</div>
          </div>
          <div className="hero-stat">
            <div className="num">3</div>
            <div className="label">nền tảng: Web · Máy tính · Điện thoại</div>
          </div>
        </div>
      </section>

      <div className="section-label">
        <div className="bar" />
        <span>Tính năng tiêu biểu</span>
      </div>
      <div className="feature-row">
        {flagship.map((s) => (
          <button key={s.id} className="feature-card" style={{ '--accent': s.color }} onClick={() => onNavigate(s.id)}>
            <div className="glow" />
            <div className="emoji">{s.emoji}</div>
            <h3>{s.title}</h3>
            <p>{flagshipBlurb(s.id)}</p>
          </button>
        ))}
      </div>

      <div className="section-label">
        <div className="bar" />
        <span>Dịch vụ cộng đồng AI (12 mục)</span>
      </div>
      <div className="module-grid">
        {SCREENS.map((s) => (
          <button key={s.id} className="module-card" style={{ '--accent': s.color }} onClick={() => onNavigate(s.id)}>
            <div className="emoji">{s.emoji}</div>
            <div className="title">{s.title}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function flagshipBlurb(id) {
  switch (id) {
    case 'coffee':
      return 'Chụp ảnh lá/quả/thân cây, nhận chẩn đoán bệnh và hướng xử lý ngay.'
    case 'forest':
      return 'Báo cáo khói cháy, khai thác gỗ trái phép kèm định vị GPS.'
    case 'camera':
      return 'Theo dõi các điểm camera giao thông và phân tích sự cố bằng AI.'
    case 'alert':
      return 'Cảnh báo thiên tai theo khu vực và kích hoạt SOS khẩn cấp.'
    default:
      return ''
  }
}
