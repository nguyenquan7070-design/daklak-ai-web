// Mirrors the `Screen` sealed class from the original Kotlin app.
// `flagship` screens get a dedicated component with extra tools (image upload, reports, etc).
// The rest use the generic ChatScreen.
export const SCREENS = [
  { id: 'citizen', title: 'AI Công dân', emoji: '🪪', color: '#3E6AA6' },
  { id: 'health', title: 'AI Sức khỏe', emoji: '🩺', color: '#c1442c' },
  { id: 'tourism', title: 'AI Du lịch', emoji: '🧭', color: '#d9932e' },
  { id: 'crime', title: 'AI Tố giác vi phạm', emoji: '🚨', color: '#8a7a68' },
  { id: 'field', title: 'AI Phản ánh hiện trường', emoji: '📸', color: '#c2601c' },
  { id: 'coffee', title: 'AI Cà phê BMT', emoji: '☕', color: '#7d5030', flagship: true },
  { id: 'agriculture', title: 'AI Nông nghiệp', emoji: '🥑', color: '#4c8c5a' },
  { id: 'forest', title: 'AI Bảo vệ rừng', emoji: '🌲', color: '#3a7d5c', flagship: true },
  { id: 'culture', title: 'AI Văn hóa Tây Nguyên', emoji: '🥁', color: '#8a4fa0' },
  { id: 'camera', title: 'AI Camera thông minh', emoji: '📹', color: '#2c8fa0', flagship: true },
  { id: 'planning', title: 'AI Quy hoạch', emoji: '🗺️', color: '#3b4e9e' },
  { id: 'alert', title: 'AI Cảnh báo & SOS', emoji: '⚡', color: '#c1442c', flagship: true },
]

export function getScreen(id) {
  return SCREENS.find((s) => s.id === id)
}

export const SUGGESTIONS = {
  citizen: [
    'Làm cách nào đăng ký tạm trú trực tuyến qua mạng?',
    'Thủ tục cấp đổi Căn cước công dân gắn chíp tại Buôn Ma Thuột?',
  ],
  health: [
    'Biểu hiện sốt xuất huyết khác sốt rét như thế nào?',
    'Khuyến cáo phòng muỗi đốt vào mùa mưa ẩm Tây Nguyên?',
  ],
  tourism: [
    'Địa chỉ trải nghiệm du lịch cưỡi voi thân thiện Buôn Đôn?',
    'Lịch trình tour du lịch thác Dray Nur - Dray Sáp 1 ngày?',
  ],
  crime: [
    'Phát hiện nghi phạm đánh bạc, nộp tin tố giác có bảo mật?',
    'Quy định khai báo vi phạm lâm sản lâm tặc phá rừng gỗ quý?',
  ],
  field: [
    'Mặt đường giao thông Lê Duẩn sạt lở ổ gà lớn, gửi phản ánh?',
    'Người dân xả rác bừa bãi ra lòng hồ Ea Kao phản ánh thế nào?',
  ],
  agriculture: [
    'Kỹ thuật kích thích sầu riêng ra hoa trái vụ mùa khô cằn?',
    'Trị rệp sáp cho cây cà phê bằng chế phẩm sinh học thế nào?',
  ],
  culture: [
    'Ý nghĩa hình dáng con thuyền của nhà dài Ê-đê bản địa?',
    'Nghe kể nhạc khí Knah trong không gian văn hóa cồng chiêng?',
  ],
  planning: [
    'Bản đồ quy hoạch Buôn Ma Thuột hướng thành đô thị sinh thái?',
    'Cao tốc Khánh Hòa - Buôn Ma Thuột đi qua những phân khúc nào?',
  ],
}

export const DISTRICTS = [
  {
    id: 'mdrak',
    name: "M'Đrắk (Đèo Phượng Hoàng)",
    risk: 'RẤT CAO',
    riskColor: '#e2593c',
    weatherTitle: 'Mưa bão lớn & nguy cơ lũ quét cực cao',
    weatherText:
      'Lượng mưa tích lũy 185mm, đất bão hòa nước. Sườn dốc dọc Đèo Phượng Hoàng có rủi ro sạt trượt rất lớn, đe dọa trực tiếp Quốc lộ 26.',
    recommendation:
      'Di dời ngay đến nhà văn hóa xã hoặc khu vực cao ráo. Chuẩn bị đèn pin, lương khô, nước uống, thuốc men.',
  },
  {
    id: 'krongbong',
    name: 'Krông Bông (Ven sông)',
    risk: 'CAO',
    riskColor: '#e8a33d',
    weatherTitle: 'Mực nước sông dâng nhanh',
    weatherText:
      'Nước từ thượng nguồn Chư Yang Sin đổ về khiến sông Krông Kno dâng 1.2m trên báo động II, ngập úng vùng trũng ven sông.',
    recommendation: 'Di chuyển đồ đạc giá trị và gia súc lên cao. Cắt cầu dao điện vùng ngập nước.',
  },
  {
    id: 'easup',
    name: 'Ea Súp (Rốn lũ lòng chảo)',
    risk: 'CAO',
    riskColor: '#e8a33d',
    weatherTitle: 'Hồ chứa xả lũ điều tiết khẩn cấp',
    weatherText:
      'Hồ Ea Súp Thượng xả lũ 150 m3/s do mưa lớn thượng nguồn. Vùng hạ lưu nguy cơ ngập sâu 0.5–1.5m.',
    recommendation: 'Không lội nước ngập sâu hoặc dòng chảy xiết. Tích trữ nước sạch, sạc đầy thiết bị liên lạc.',
  },
  {
    id: 'bmt',
    name: 'TP. Buôn Ma Thuột',
    risk: 'AN TOÀN',
    riskColor: '#4fae7f',
    weatherTitle: 'Thời tiết ổn định, mưa nhẹ chiều tối',
    weatherText: 'Mưa rải rác 10-15mm. Hệ thống thoát nước đô thị vận hành bình thường, không ghi nhận nguy cơ thiên tai.',
    recommendation: 'Duy trì sinh hoạt bình thường, theo dõi bản tin thời tiết định kỳ.',
  },
]

export const CAMERA_LOCATIONS = [
  'Vòng xoay Ngã Sáu BMT',
  'Nguyễn Tất Thành - 10/3',
  'Ngã ba Duy Hòa',
  'Phan Bội Châu (dốc)',
  'Cổng chào TP. Buôn Ma Thuột',
  'Đèo Phượng Hoàng (M\'Đrắk)',
]
