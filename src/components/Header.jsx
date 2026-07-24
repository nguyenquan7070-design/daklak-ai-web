export default function Header({ title, accent, onBack, onClear }) {
  return (
    <div className="top-header" style={{ '--accent': accent }}>
      <button className="icon-btn" onClick={onBack} aria-label="Quay lại" title="Quay lại">
        ←
      </button>
      <h1>{title}</h1>
      {onClear && (
        <button className="icon-btn" onClick={onClear} aria-label="Xóa lịch sử" title="Xóa lịch sử trò chuyện">
          🗑
        </button>
      )}
    </div>
  )
}
