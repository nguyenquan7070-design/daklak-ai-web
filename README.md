# Đắk Lắk AI — Bản Web (v1)

Bản Web đầu tiên của Đắk Lắk AI, viết bằng **React + Vite**, dùng chung 1 bộ mã nguồn
để sau này đóng gói thêm bản Máy tính (Electron) và Điện thoại (Capacitor).

## Đã có trong bản này

- Khung điều hướng đầy đủ 12 dịch vụ AI (trang chủ dạng lưới, giống bản Kotlin gốc)
- Chat AI dùng chung cho 8 mục cơ bản (Công dân, Sức khỏe, Du lịch, Tố giác, Hiện trường,
  Nông nghiệp, Văn hóa, Quy hoạch) với phản hồi mô phỏng tiếng Việt chất lượng cao
- 4 module tiêu biểu (flagship) có giao diện riêng:
  - **☕ AI Cà phê BMT** — chọn bộ phận cây, tải ảnh, nhận chẩn đoán bệnh + lịch sử
  - **🌲 AI Bảo vệ rừng** — báo cháy/khai thác gỗ trái phép kèm ảnh + tọa độ mô phỏng
  - **📹 AI Camera thông minh** — danh sách camera mô phỏng + phân tích sự cố AI
  - **⚡ AI Cảnh báo & SOS** — cảnh báo thiên tai theo khu vực + nút SOS khẩn cấp
- Lưu trữ cục bộ bằng `localStorage` (lịch sử chat, báo cáo) — không cần backend để test
- Có thể gắn API key Gemini thật qua file `.env` (xem `.env.example`); nếu không có key,
  toàn bộ app vẫn chạy đầy đủ bằng phản hồi mô phỏng

## Chạy thử trên máy bạn

Cần cài sẵn [Node.js](https://nodejs.org) (bản 18 trở lên).

```bash
cd daklak-ai-web
npm install
npm run dev
```

Mở trình duyệt tại địa chỉ hiện ra trong terminal (thường là `http://localhost:5173`).

Muốn dùng Gemini thật: sao chép `.env.example` thành `.env`, dán API key vào, rồi chạy lại
`npm run dev`.

## Giới hạn đã biết ở bản Web

- **SOS gọi điện/nhắn tin**: trình duyệt không có quyền tự động gọi điện hoặc gửi SMS.
  App sẽ mở sẵn ứng dụng Gọi điện/Nhắn tin với nội dung điền sẵn, người dùng cần tự bấm
  gửi/gọi. Đây là giới hạn của mọi trình duyệt, không phải lỗi — sẽ được nâng cấp thành
  tự động thật khi đóng gói bản Điện thoại bằng Capacitor.
- **Camera giao thông**: hiện là danh sách mô phỏng, chưa nối luồng camera thật.
- **Phân tích ảnh AI**: dùng logic mô phỏng theo tên file/mô tả (giống bản Kotlin gốc khi
  chưa có API key); khi bật Gemini Vision thật cần bổ sung phần gửi ảnh base64 (đã chừa sẵn
  vị trí trong `src/services/geminiService.js`).

## Bản Máy tính (Electron)

Dùng chung toàn bộ mã nguồn React ở trên, chỉ thêm một "vỏ bọc" Electron để chạy thành
cửa sổ ứng dụng riêng (không cần mở trình duyệt).

**Chạy thử ở chế độ phát triển** (vừa sửa code vừa xem thay đổi ngay):

```bash
npm run electron:dev
```

Lệnh này tự chạy song song server web (Vite) và mở cửa sổ Electron trỏ vào đó.

**Chạy như bản build thật** (giống trải nghiệm cuối cùng người dùng sẽ thấy):

```bash
npm run electron:start
```

**Đóng gói thành file cài đặt** (`.exe` cho Windows, `.dmg` cho macOS, `.AppImage` cho Linux):

```bash
npm run electron:dist
```

File cài đặt sẽ nằm trong thư mục `release/` sau khi chạy xong. Lưu ý: đóng gói `.dmg` cho
macOS cần chạy trên máy Mac thật (Apple không cho build macOS từ Windows/Linux).

## Kế hoạch tiếp theo (đã thống nhất với bạn)

1. ✅ **Bản Web** — đã test thành công
2. ✅ **Bản Máy tính (Electron)** — đang ở đây, bạn test tiếp
3. ⏭️ **Bản Điện thoại** — đóng gói bằng Capacitor cho Android + iOS, bật quyền gọi
   điện/SMS/camera/GPS thật
4. ⏭️ Bổ sung 8 module còn lại thành giao diện chuyên biệt (hiện dùng chat chung)
5. ⏭️ Nối Firebase/Firestore thật cho lưu trữ đồng bộ nhiều thiết bị

## Cấu trúc thư mục

```
src/
  data/screens.js        12 module + dữ liệu mẫu (khu vực thiên tai, camera...)
  services/
    geminiService.js      Gọi Gemini thật (nếu có key) + phản hồi mô phỏng
    storage.js             Lưu trữ cục bộ (localStorage)
  components/
    Home.jsx                Trang chủ
    ChatScreen.jsx           Khung chat dùng chung
    CoffeeModule.jsx         Module Cà phê
    ForestModule.jsx         Module Bảo vệ rừng
    CameraModule.jsx         Module Camera
    AlertSOS.jsx             Module Cảnh báo & SOS
  App.jsx                  Điều hướng chính
  styles/theme.css          Toàn bộ giao diện (màu, font, layout)
```
