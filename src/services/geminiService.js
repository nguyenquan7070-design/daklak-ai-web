// Đắk Lắk AI — Gemini service (web)
// If VITE_GEMINI_API_KEY is set in a .env file, real calls are attempted.
// Otherwise (and on any API error), a high-quality simulated response is used,
// so the app is fully usable and testable without any backend or API key.

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const MODEL = 'gemini-3.5-flash'

function hasValidKey() {
  return API_KEY && !API_KEY.includes('YOUR_') && !API_KEY.includes('PLACEHOLDER')
}

const SYSTEM_PROMPTS = {
  citizen:
    "Bạn là 'AI Công dân' phục vụ người dân tỉnh Đắk Lắk. Trả lời về thủ tục hành chính, dịch vụ công trực tuyến, chính sách công dân một cách lịch sự, chuẩn xác.",
  health:
    "Bạn là 'AI Sức khỏe' phục vụ người dân Đắk Lắk. Tư vấn y tế, phòng bệnh nhiệt đới, sơ cứu. Luôn nhắc người dùng đi khám bác sĩ khi cần.",
  tourism: "Bạn là 'AI Du lịch Đắk Lắk'. Hướng dẫn tham quan thác Dray Nur, Hồ Lắk, Buôn Đôn, đặc sản và văn hóa bản địa.",
  crime: "Bạn là 'AI Tố giác vi phạm' thuộc Công an tỉnh Đắk Lắk. Tiếp nhận phản ánh an ninh trật tự với thái độ bảo mật tuyệt đối.",
  field: "Bạn là 'AI Phản ánh hiện trường' của tỉnh Đắk Lắk. Hỗ trợ ghi nhận ổ gà, rác thải, ô nhiễm đô thị.",
  coffee: "Bạn là chuyên gia 'AI Cà phê Buôn Ma Thuột'. Am hiểu kỹ thuật pha chế, lịch sử Robusta, bệnh hại cây cà phê.",
  agriculture: "Bạn là kỹ sư 'AI Nông nghiệp Đắk Lắk'. Tư vấn trồng cà phê, sầu riêng, hồ tiêu, tưới tiết kiệm nước.",
  forest: "Bạn là 'AI Bảo vệ rừng Tây Nguyên'. Tư vấn bảo tồn Yok Don, cảnh báo cháy rừng, phản ánh phá rừng trái phép.",
  culture: "Bạn là đại sứ 'AI Văn hóa Tây Nguyên'. Giới thiệu cồng chiêng, nhà dài Ê Đê, rượu cần, trường ca cổ.",
  camera: "Bạn là trợ lý 'AI Camera thông minh'. Giới thiệu camera AI giao thông, nhận diện vi phạm, điều tiết luồng xe.",
  planning: "Bạn là chuyên viên 'AI Quy hoạch Đắk Lắk'. Giải đáp quy hoạch đất đai, tầm nhìn đô thị Buôn Ma Thuột.",
  alert: "Bạn là 'AI Cảnh báo thông minh'. Cung cấp cảnh báo thiên tai, ngập lụt, hạn hán và biện pháp phòng ngừa an toàn.",
}

async function callGeminiText(screenId, userPrompt) {
  const system = SYSTEM_PROMPTS[screenId] || "Bạn là 'Đắk Lắk AI' - trợ lý thông minh của tỉnh Đắk Lắk."
  const combined = `${system}\n\nNgười dùng tại Đắk Lắk hỏi: ${userPrompt}`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: combined }] }] }),
    },
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API lỗi ${res.status}: ${body}`)
  }
  const json = await res.json()
  return json?.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có nội dung trả về từ Gemini.'
}

export async function generateResponse(screenId, userPrompt) {
  if (hasValidKey()) {
    try {
      return await callGeminiText(screenId, userPrompt)
    } catch (e) {
      console.error('Gemini API error, falling back to simulation', e)
      return (
        getSimulatedResponse(screenId, userPrompt) +
        '\n\n*(Lưu ý: Hệ thống đang phản hồi từ cơ sở dữ liệu dự phòng cục bộ do lỗi kết nối.)*'
      )
    }
  }
  // small artificial delay so the typing indicator feels natural
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 500))
  return getSimulatedResponse(screenId, userPrompt)
}

export async function analyzeImage(screenId, userPrompt, imageLabel) {
  // NOTE: real Gemini Vision wiring can be added the same way as callGeminiText
  // (send inlineData with base64 of the uploaded file) once a real API key is set.
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 600))
  return getSimulatedVisionResponse(screenId, userPrompt, imageLabel)
}

function getSimulatedResponse(screenId) {
  switch (screenId) {
    case 'citizen':
      return (
        '**[AI CÔNG DÂN ĐẮK LẮK]**\n\n' +
        'Để làm thủ tục cư trú/căn cước tại Đắk Lắk:\n' +
        '1. **Địa điểm**: Bộ phận Một cửa UBND xã/phường hoặc Công an huyện/TP. Buôn Ma Thuột.\n' +
        '2. **Cổng dịch vụ công**: dichvucong.daklak.gov.vn để tiết kiệm thời gian.\n' +
        '3. **Hồ sơ**: Phiếu khai báo cư trú (CT01), giấy tờ chứng minh nơi ở hợp pháp.\n\n' +
        'Bạn cần tôi tra cứu văn phòng hành chính gần nhất không?'
      )
    case 'health':
      return (
        '**[TƯ VẤN SỨC KHỎE TÂY NGUYÊN]**\n\n' +
        '- **Phòng ngừa**: Dọn lu vại nước quanh nhà, ngủ mùng cả ban ngày.\n' +
        '- **Nhận biết sớm**: Sốt cao liên tục 2-7 ngày, đau hốc mắt, xuất huyết dưới da.\n' +
        '- **Xử lý**: Đến ngay Bệnh viện Đa khoa Vùng Tây Nguyên hoặc trạm y tế gần nhất.\n\n' +
        '*Đây là thông tin tham khảo, không thay thế chẩn đoán của bác sĩ.*'
      )
    case 'tourism':
      return (
        '**[CẨM NANG DU LỊCH ĐẮK LẮK]**\n\n' +
        '1. **Buôn Đôn**: cầu treo sông Sêrêpôk, nhà sàn vua voi Amacông.\n' +
        '2. **Thác Dray Nur & Dray Sáp**: cách BMT ~25km.\n' +
        '3. **Hồ Lắk**: thuyền độc mộc, Buôn Jun người M\'Nông.\n' +
        '4. **Bảo tàng Thế giới Cà phê**: kiến trúc nhà dài Tây Nguyên.\n\n' +
        'Bạn muốn lịch trình 2 ngày 1 đêm không?'
      )
    case 'crime':
      return (
        '**[KÊNH TIẾP NHẬN TỐ GIÁC]**\n\n' +
        'Thông tin của bạn được mã hóa và bảo mật. Vui lòng gửi:\n' +
        '1. Mô tả hành vi, địa điểm, đối tượng liên quan.\n' +
        '2. Hình ảnh/video (dùng nút đính kèm ảnh).\n' +
        '3. Khẩn cấp: gọi trực tiếp 113.\n'
      )
    case 'field':
      return (
        '**[PHẢN ÁNH HIỆN TRƯỜNG]**\n\n' +
        'Hệ thống tiếp nhận: ổ gà, đèn hỏng, ngập lụt, cây gãy đổ, rác sai quy định.\n' +
        'Hãy đính kèm ảnh hiện trường để gửi đến Trung tâm Điều hành Thông minh (IOC) tỉnh.'
      )
    case 'agriculture':
      return (
        '**[AI NÔNG NGHIỆP ĐẮK LẮK]**\n\n' +
        '1. **Cà phê**: đang vào đợt tưới 2-3 kết hợp bón phân đón hoa, chú ý rệp sáp hại rễ.\n' +
        '2. **Sầu riêng (Dona, Ri6)**: quản lý nước chặt để kích hoa đồng loạt.\n' +
        '3. **Sấy nông sản**: nhà màng năng lượng mặt trời giúp đạt chuẩn OCOP.\n\n' +
        'Bạn muốn hỏi kỹ thuật cho cây trồng nào?'
      )
    case 'culture':
      return (
        '**[VĂN HÓA CỒNG CHIÊNG TÂY NGUYÊN]**\n\n' +
        '- **Nhà Dài Êđê**: hình dáng con thuyền, biểu tượng chế độ mẫu hệ.\n' +
        '- **Rượu cần**: uống qua cần tre quanh ché đất nung.\n' +
        '- **Cồng chiêng**: các bộ Knah, Aráp vang vọng đại ngàn.\n\n' +
        'Bạn muốn nghe thêm về Khan cổ không?'
      )
    case 'planning':
      return (
        '**[QUY HOẠCH ĐẮK LẮK]**\n\n' +
        '- BMT phát triển thành "đô thị sinh thái, bản sắc" Tây Nguyên.\n' +
        '- KCN Hòa Phú mở rộng cho chế biến nông sản công nghệ cao.\n' +
        '- Cao tốc Khánh Hòa - Buôn Ma Thuột đang thi công.\n'
      )
    case 'alert':
      return (
        '**[CẢNH BÁO KHẨN CẤP]**\n\n' +
        '- Ea Súp, Krông Bông: mưa rải rác, nguy cơ giông sét chiều tối.\n' +
        '- Đèo M\'Đrắk: sương mù nhẹ sáng sớm, giảm tốc độ dưới 40km/h.\n\n' +
        'Xem chi tiết từng khu vực ở mục Cảnh báo & SOS.'
      )
    default:
      return 'Chào mừng đến với **Đắk Lắk AI** — nền tảng trợ lý thông minh cho người dân tỉnh nhà!'
  }
}

function getSimulatedVisionResponse(screenId, userPrompt, imageLabel) {
  const q = (userPrompt || '').toLowerCase()
  const label = (imageLabel || '').toLowerCase()

  if (screenId === 'coffee') {
    if (label.includes('leaf') || label.includes('lá') || q.includes('lá')) {
      return {
        title: 'Bệnh Rỉ Sắt Cà Phê',
        hazard: 'Trung bình',
        condition: 'Đốm vàng đồng tâm, mặt dưới lá phủ phấn cam mịn.',
        treatment: 'Thu gom lá bệnh, cắt tỉa thông thoáng, phun thuốc gốc đồng/Bordeaux 1%.',
        text:
          '**[PHÂN TÍCH LÁ CÀ PHÊ]**\n\nChẩn đoán: **Bệnh Rỉ Sắt Cà Phê**. Mức độ: Trung bình.\n' +
          'Gợi ý: thu gom lá rụng tiêu hủy, cắt tỉa cành thông thoáng, phun thuốc gốc đồng định kỳ mùa mưa.',
      }
    }
    if (label.includes('fruit') || label.includes('quả') || q.includes('quả') || q.includes('trái')) {
      return {
        title: 'Bệnh Thán Thư Quả',
        hazard: 'Cao',
        condition: 'Đốm thối nâu tròn, lõm sâu, dập vỏ lan nhanh.',
        treatment: 'Phun Azoxystrobin + Difenoconazole, bổ sung Canxi-Bo cho vỏ chắc.',
        text:
          '**[PHÂN TÍCH QUẢ CÀ PHÊ]**\n\nChẩn đoán: **Bệnh Thán Thư/Thối Trái**. Mức độ: Cao.\n' +
          'Gợi ý: không bón đạm thừa giai đoạn hạt, phun thuốc trừ nấm và bổ sung Canxi-Bo.',
      }
    }
    return {
      title: 'Sâu Đục Thân Mình Trắng',
      hazard: 'Nguy hiểm',
      condition: 'Vỏ sần sùi bong tróc, rãnh đục sâu kèm mùn gỗ.',
      treatment: 'Cắt tiêu hủy cành sâu rỗng, quét vôi loãng gốc cây cao 1.2m.',
      text:
        '**[PHÂN TÍCH THÂN CÂY CÀ PHÊ]**\n\nChẩn đoán: **Sâu Đục Thân Mình Trắng**. Mức độ: Nguy hiểm.\n' +
        'Gợi ý: cắt bỏ cành đục rỗng ngay, quét vôi loãng thân cây để ngăn bướm đẻ trứng.',
    }
  }

  if (screenId === 'forest') {
    if (label.includes('smoke') || label.includes('khói') || q.includes('khói') || q.includes('cháy')) {
      return {
        classification: 'cháy rừng',
        text:
          '**[PHÂN LOẠI KHẨN CẤP]**\n\nPhát hiện: khói xám bốc cao từ rừng khộp khô.\n' +
          'Phân loại: **Cháy rừng**. Đã chuyển cảnh báo đỏ đến ban quản lý bảo tồn tỉnh.',
      }
    }
    if (label.includes('logging') || q.includes('gỗ') || q.includes('phá') || q.includes('lâm tặc')) {
      return {
        classification: 'khai thác gỗ trái phép',
        text:
          '**[PHÂN LOẠI KHẨN CẤP]**\n\nPhát hiện: dấu vết cưa máy, lán trại lén lút.\n' +
          'Phân loại: **Phá rừng / Khai thác gỗ trái phép**. Đã mã hóa GPS gửi đội tuần tra kiểm lâm.',
      }
    }
    return {
      classification: 'bất thường khác',
      text: '**[BIỂU HIỆN BẤT THƯỜNG]**\n\nPhát hiện xe cơ giới di chuyển bất thường gần khu bảo vệ nghiêm ngặt.',
    }
  }

  if (screenId === 'camera') {
    if (q.includes('ùn tắc') || q.includes('kẹt') || q.includes('xe')) {
      return {
        classification: 'ùn tắc',
        alertLevel: 'Trung bình',
        text: '**[SMART CAMERA]**\n\nMật độ xe tăng cao tại nút giao. Phân loại: **Ùn tắc giao thông**. Mức: Trung bình.',
      }
    }
    if (q.includes('nước') || q.includes('ngập')) {
      return {
        classification: 'ngập nước',
        alertLevel: 'Cao',
        text: '**[SMART CAMERA]**\n\nPhát hiện ngập sâu ~25cm sau mưa lớn. Phân loại: **Ngập nước**. Mức: Cao.',
      }
    }
    if (q.includes('tai nạn') || q.includes('va chạm')) {
      return {
        classification: 'tai nạn',
        alertLevel: 'Khẩn cấp',
        text: '**[SMART CAMERA]**\n\nGhi nhận va chạm giữa 2 phương tiện. Phân loại: **Tai nạn**. Mức: Khẩn cấp.',
      }
    }
    return {
      classification: 'bất thường khác',
      alertLevel: 'Thấp',
      text: '**[SMART CAMERA]**\n\nKhông phát hiện sự cố rõ rệt trong khung hình hiện tại.',
    }
  }

  return { text: 'Phân tích thành công.' }
}
